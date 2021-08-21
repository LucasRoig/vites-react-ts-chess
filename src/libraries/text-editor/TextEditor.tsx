import React, {KeyboardEvent, useEffect, useState} from "react";
import {getCaretPosition, isCaretOnFirstLine, isCaretOnLastLine} from "./Utils";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";
import TextEditorContextProvider, {TextEditorContext, useTextEditorContext} from "./TextEditorContext";
import {
  BlockTypeNames, BulletListBlockModel,
  ChessGameBlockModel,
  Heading1BlockModel,
  Heading2BlockModel,
  Heading3BlockModel,
  TextBlockModel
} from "./Models";
import "./css.scss"
import {ChessGameBlock} from "./block-views/ChessGameBlock";
import {Menu} from "@headlessui/react";
import {Block} from "./BlocksController";
import {BulletListBlock, Heading1Block, Heading2Block, Heading3Block, TextBlock} from "./block-views/TextBlock";
import {RouteComponentProps} from "react-router-dom";
import {DocumentService} from "./DocumentService";
import {toast} from "react-toastify";

interface TextEditorProps extends RouteComponentProps<{id: string}>{}

const TextEditor: React.FC<TextEditorProps> = (props) => {
  return (
    <TextEditorContextProvider>
      <Page {...props}/>
    </TextEditorContextProvider>
  )
}

interface PageProps extends RouteComponentProps<{id: string}>{}

const Page: React.FC<PageProps> = (props) => {
  const textEditor = useTextEditorContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  useEffect(() => {
    (async () => {
      try {
        const document = await DocumentService.getDocument(props.match.params.id);
        textEditor.setTempDoc(document)
        setLoading(false)
      } catch (e: unknown) {
        toast.error("Cannot open document with id: " + props.match.params.id)
        setLoading(false)
        setError(true)
        console.error(e)
      }
    })()
  }, [])

  if (loading) {
    return <div>loading...</div>
  }
  if (error) {
    return <div>404</div>
  }

  return (
    <div style={{padding: "0 10rem 0 10rem", background: "white", height: "100%"}}>
      <PageTitle title={textEditor.document.title} setTitle={textEditor.setTitle} focusedId={textEditor.focusedBlock}  />
      <div style={{paddingLeft: "10px"}}>
        {textEditor.document.blocks.map(b =>
          <EditableBlock key={b.id} block={b}/>
        )}
      </div>
    </div>
  )
}

interface EditableBlockProps {
  block: Block
}

class EditableBlock extends React.Component<EditableBlockProps, {}> {
  static contextType = TextEditorContext
  context!: React.ContextType<typeof TextEditorContext>
  ref: React.RefObject<HTMLElement>
  constructor(props: EditableBlockProps) {
    super(props);
    this.ref = React.createRef()
  }

  handleFocus = () => {
    this.context.setFocus(this.props.block.id)
  }

  handleBlur = () => {
    this.context.unsetFocus(this.props.block.id)
  }

  onKeyPressed = (e: KeyboardEvent<HTMLDivElement>) => {
    console.log("key pressed", e.key)
    if (!this.ref.current) {
      return
    }
    if (this.props.block.isText) {
      if (e.key === "Enter" && !e.shiftKey) {
        this.addBlockAfter()
        e.preventDefault()
      }
      if (e.key === "ArrowUp" && (this.props.block.content.length === 0 || isCaretOnFirstLine(this.ref.current))) {
        this.context.focusPreviousBlock(this.props.block.id)
        e.preventDefault()
      }
      if ((e.key === "ArrowLeft") && this.ref.current) {
        const caretPos = getCaretPosition(this.ref.current)
        console.log(document.getSelection()?.getRangeAt(0).getClientRects()[0].bottom, document.getSelection()?.getRangeAt(0).getClientRects()[0].right)
        console.log("caretPos: ", caretPos, "carret right :", document.getSelection()?.getRangeAt(0).getBoundingClientRect().right, "bottom :", document.getSelection()?.getRangeAt(0).getBoundingClientRect().bottom)
        if (caretPos && caretPos[0] === caretPos[1] && caretPos[0] === 0) {
          this.context.focusPreviousBlock(this.props.block.id)
          e.preventDefault()
        }
      }
      if (e.key === "ArrowDown" && (this.props.block.content.length === 0 ||isCaretOnLastLine(this.ref.current))) {
        this.context.focusNextBlock(this.props.block.id)
        e.preventDefault()
      }
      if ((e.key === "ArrowRight") && this.ref.current) {
        const caretPos = getCaretPosition(this.ref.current)
        // const previousRange = document.getSelection()!.getRangeAt(0)
        // const r = document.createRange()
        // r.setStart(previousRange.startContainer, this.props.block.content.length)
        // r.setEnd(previousRange.startContainer, this.props.block.content.length)
        // document.getSelection()!.removeAllRanges()
        // document.getSelection()!.addRange(r)
        // const r2 = document.createRange()
        // r2.setStart(previousRange.startContainer, previousRange.startOffset)
        // r2.setEnd(previousRange.startContainer, previousRange.startOffset)
        // document.getSelection()!.removeAllRanges()
        // document.getSelection()!.addRange(r2)
        // console.log(document.getSelection()?.getRangeAt(0).getClientRects()[0].bottom, document.getSelection()?.getRangeAt(0).getClientRects()[0].right)
        // console.log("caretPos: ", caretPos, "carret right :", document.getSelection()?.getRangeAt(0).getBoundingClientRect().right, "bottom :", document.getSelection()?.getRangeAt(0).getBoundingClientRect().bottom)
        // let r = document.getSelection()?.getRangeAt(0);
        // let s = document.createElement('span');
        // r!.insertNode(s);
        // let top = ((s.offsetTop - s!.parentNode!.offsetTop) === 0);
        // let bottom = ((s.offsetTop - s.parentElement!.offsetTop + s.offsetHeight) >= s.parentElement!.offsetHeight);
        // s.parentNode!.removeChild(s);
        // console.log('top ', top, 'bottom', bottom)
        if (caretPos && caretPos[0] === caretPos[1] && caretPos[0] === this.props.block.content.length) {
          this.context.focusNextBlock(this.props.block.id)
          e.preventDefault()
        }
      }
      if (e.key === "Backspace" && this.props.block.content.length === 0) {
        this.deleteBlock()
      }
    }
  }

  addBlockAfter = () => {
    this.context.insertNewBlockAfter(this.props.block.id)
  }

  onChange = (e: ContentEditableEvent) => {
    console.log(e.target.value)
    this.context.setBlockContent(e.target.value, this.props.block.id)
  }

  turnInto = (newType: BlockTypeNames) => {
    this.context.turnBlockInto(this.props.block.id, newType);
  }

  deleteBlock = () => {
    this.context.deleteBlock(this.props.block.id)
  }

  componentDidMount() {
    if (this.context.focusedBlock && this.context.focusedBlock === this.props.block.id && this.ref.current) {
      this.ref.current.focus()
    }
  }

  componentDidUpdate(prevProps: Readonly<EditableBlockProps>, prevState: Readonly<{}>, snapshot?: any) {
    console.log("update", this.context.focusedBlock)
    if (this.context.focusedBlock && this.context.focusedBlock === this.props.block.id && this.ref.current) {
      this.ref.current.focus()
    }
  }

  switchBlock(block: Block) {
    switch (block.type) {
      case BlockTypeNames.Text:
        return <TextBlock block={this.props.block as TextBlockModel} onChange={this.onChange} reference={this.ref}
                          isFocused={this.props.block.id === this.context.focusedBlock}/>
      case BlockTypeNames.ChessGame:
        return <ChessGameBlock block={this.props.block as ChessGameBlockModel}/>
      case BlockTypeNames.Heading1:
        return <Heading1Block block={this.props.block as Heading1BlockModel} onChange={this.onChange} reference={this.ref}
                          isFocused={this.props.block.id === this.context.focusedBlock}/>
      case BlockTypeNames.Heading2:
        return <Heading2Block block={this.props.block as Heading2BlockModel} onChange={this.onChange} reference={this.ref}
                              isFocused={this.props.block.id === this.context.focusedBlock}/>
      case BlockTypeNames.Heading3:
        return <Heading3Block block={this.props.block as Heading3BlockModel} onChange={this.onChange} reference={this.ref}
                              isFocused={this.props.block.id === this.context.focusedBlock}/>
      case BlockTypeNames.BulletList:
        return <BulletListBlock block={this.props.block as BulletListBlockModel} onChange={this.onChange} reference={this.ref}
                              isFocused={this.props.block.id === this.context.focusedBlock}/>
    }
  }

  render() {
    return (
      <div onFocus={this.handleFocus} onBlur={this.handleBlur} onKeyDown={this.onKeyPressed} className="block" style={{display: "flex", alignItems: "baseline", position: "relative"}}>
        <div className={"btn-container-left-block"}>
          <button className="button is-small is-rounded is-inverted is-primary" onClick={this.addBlockAfter}>
            <span className="icon is-small">
              <i className="fas fa-plus" />
            </span>
          </button>
          <EditBlockMenu turnInto={this.turnInto} deleteBlock={this.deleteBlock} block={this.props.block} />
        </div>
        {
          this.switchBlock(this.props.block)
        }
      </div>
    )
  }
}
interface PageTitleProps {
  title: string, setTitle: (title: string) => void, focusedId: string | undefined
}
class PageTitle extends React.Component<PageTitleProps> {
  static contextType = TextEditorContext
  context!: React.ContextType<typeof TextEditorContext>
  ref: React.RefObject<HTMLElement>

  constructor(props: PageTitleProps) {
    super(props);
    this.ref = React.createRef()
  }

  handleChange = (e: ContentEditableEvent) => {
    this.props.setTitle(e.target.value)
  }

  handleBlur = () => {
    this.context.unsetFocus(this.context.titleBlockId)
  }

  componentDidUpdate(prevProps: Readonly<PageTitleProps>, prevState: Readonly<{}>, snapshot?: any) {
    if (this.props.focusedId !== prevProps.focusedId && this.props.focusedId === this.context.titleBlockId && this.ref.current) {
      this.ref.current.focus()
    }
  }

  handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!this.ref.current) {
      return
    }
    if (e.key === "ArrowDown" && (this.props.title.length === 0 || isCaretOnLastLine(this.ref.current))) {
      this.context.focusNextBlock(this.context.titleBlockId)
      e.preventDefault()
      e.stopPropagation()
    }
    if (e.key === "ArrowRight") {
      const caretPosition = getCaretPosition(this.ref.current);
      if (caretPosition && caretPosition[0] === caretPosition[1] && caretPosition[0] === this.props.title.length) {
        this.context.focusNextBlock(this.context.titleBlockId)
        e.preventDefault();
        e.stopPropagation()
      }
    }
    if (e.key === "Enter") {
      this.context.insertNewBlockAfter(this.context.titleBlockId)
      e.preventDefault()
      e.stopPropagation()
    }
  }

  render() {
    const styles: any = {}
    if (this.props.title.length === 0) {
      styles.color = "rgba(55, 53, 47, 0.15)"
    }

    return (
      <div style={{fontWeight: 700, lineHeight: 1.2, fontSize: "40px", paddingBottom: "20px", paddingTop: "80px", ...styles}} onBlur={this.handleBlur}>
        <ContentEditable html={this.props.title} onChange={this.handleChange} placeholder={"New Document"} innerRef={this.ref} onKeyDown={this.handleKeyDown}/>
      </div>
    )
  }
}

const EditBlockMenu: React.FC<{turnInto: (t: BlockTypeNames) => void, deleteBlock: () => void, block: Block}> = (props) => {
  const turnInto = (type: BlockTypeNames) => {
    props.turnInto(type)
  }
  return (
    <Menu>
      <div className={"dropdown is-active"} style={{marginRight: "1rem"}}>
        <Menu.Button className="button is-small is-rounded is-inverted is-primary" >
                <span className="icon is-small">
                  <i className="fas fa-bars"/>
                </span>
        </Menu.Button>
        <Menu.Items>
          <div className={"dropdown-menu"}>
            <div className={"dropdown-content"}>
              <p className="dropdown-item"><b>Turn into</b></p>
              <Menu.Item>
                <a className={`dropdown-item`}
                   onClick={turnInto.bind(null, BlockTypeNames.ChessGame)}>ChessGame</a>
              </Menu.Item>
              <Menu.Item>
                <a className={`dropdown-item`}
                   onClick={turnInto.bind(null, BlockTypeNames.Text)}>Text</a>
              </Menu.Item>
              <Menu.Item>
                <a className={`dropdown-item`}
                   onClick={turnInto.bind(null, BlockTypeNames.Heading1)}>Heading 1</a>
              </Menu.Item>
              <Menu.Item>
                <a className={`dropdown-item`}
                   onClick={turnInto.bind(null, BlockTypeNames.Heading2)}>Heading 2</a>
              </Menu.Item>
              <Menu.Item>
                <a className={`dropdown-item`}
                   onClick={turnInto.bind(null, BlockTypeNames.Heading3)}>Heading 3</a>
              </Menu.Item>
              <Menu.Item>
                <a className={`dropdown-item`}
                   onClick={turnInto.bind(null, BlockTypeNames.BulletList)}>Bullet List</a>
              </Menu.Item>
              <hr className="dropdown-divider"/>
              <Menu.Item>
                <a className="dropdown-item" onClick={props.deleteBlock}>Delete</a>
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </div>
    </Menu>
  )
}

export default TextEditor;
