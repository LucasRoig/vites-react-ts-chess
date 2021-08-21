import React, {useContext,} from "react";
import {BlockTypeNames} from "./Models";
import {BlocksController, Document, newDocument} from "./BlocksController";
import {DocumentService, TempDocument} from "./DocumentService";

export const TextEditorContext = React.createContext<{
  document: Document,
  focusedBlock: string | undefined
  setBlockContent: (content: string, blockId: string) => void,
  insertNewBlockAfter: (blockId: string) => void,
  insertBlockAfter: (blockId: string, newBlockType: BlockTypeNames) => void,
  setFocus: (blockId: string) => void,
  unsetFocus: (blockId: string) => void,
  focusPreviousBlock: (blockId: string) => void,
  focusNextBlock: (blockId: string) => void,
  deleteBlock: (blockId: string) => void,
  turnBlockInto: (blockId: string, newType: BlockTypeNames) => void,
  setTempDoc: (doc: TempDocument) => void,
  setTitle: (title: string) => void,
  titleBlockId: string,
  saveDocument: () => void,
}>({
  document: newDocument(),
  setBlockContent: () => {},
  insertNewBlockAfter: () => {},
  focusedBlock: undefined,
  setFocus: () => {},
  unsetFocus: () => {},
  focusPreviousBlock: () => {},
  focusNextBlock: () => {},
  deleteBlock: () => {},
  turnBlockInto: () => {},
  setTempDoc: () => {},
  insertBlockAfter: () => {},
  setTitle: (title: string) => {},
  titleBlockId: "title",
  saveDocument: () => {}
})

class TextEditorContextProvider extends React.Component<{}, {
  document: Document,
  focusedBlock: string | undefined,
  tempId: string
}> {
  titleBlockId = "title"
  constructor(props: {}) {
    super(props);
    this.state = ({
      document: newDocument(),
      focusedBlock: undefined,
      tempId: ""
    })
  }

  setTitle = (title: string) => {
    this.setState({
      document: {
        ...this.state.document,
        title: title
      }
    }, this.saveDocument)
  }

  setTempDoc = (doc: TempDocument) => {
    this.setState({
      document: doc.document,
      tempId: doc.tempId,
      focusedBlock: undefined
    })
  }

  setBlockContent = (content: string, blockId: string) => {
    const document = this.state.document
    const newData = document.blocks.map(b => b.id === blockId ? {...b, content} : b)
    this.setState({
      document: {
        ...document,
        blocks: newData
      }
    }, this.saveDocument)
  }

  saveDocument = () => {
    DocumentService.updateTempDocument(this.state.tempId, this.state.document)
  }

  insertNewBlockAfter = (blockId: string) => {
    this.insertBlockAfter(blockId, BlockTypeNames.Text)
  }

  insertBlockAfter = (blockId: string, newBlockType: BlockTypeNames) => {
    const document = this.state.document
    const i = document.blocks.findIndex(b => b.id === blockId);
    if (i >= 0 || blockId === this.titleBlockId) {
      const newTab = [...document.blocks]
      const nBlock = BlocksController.make(newBlockType)
      newTab.splice(i + 1, 0, nBlock)
      this.setState({
        document: {
          ...document,
          blocks: newTab
        },
        focusedBlock: nBlock.id
      }, this.saveDocument)
    }
  }

  setFocus = (blockId: string) => {
    console.log("setFocus, " + blockId)
    this.setState({focusedBlock: blockId})
  }

  unsetFocus = (blockId: string) => {
    if (this.state.focusedBlock === blockId) {
      this.setState({focusedBlock: undefined})
    }
  }

  focusPreviousBlock = (currentBlockId: string) => {
    const index = this.state.document.blocks.findIndex(b => b.id === currentBlockId)
    if (index > 0) {
      this.setFocus(this.state.document.blocks[index - 1].id)
    } else if (index === 0) {
      this.setFocus(this.titleBlockId)
    }
  }

  focusNextBlock = (currentBlockId: string) => {
    if (currentBlockId === this.titleBlockId && this.state.document.blocks.length) {
      this.setFocus(this.state.document.blocks[0].id)
    }
    const index = this.state.document.blocks.findIndex(b => b.id === currentBlockId)
    if (index + 1 < this.state.document.blocks.length) {
      this.setFocus(this.state.document.blocks[index + 1].id)
    }
  }

  deleteBlock = (blockId: string) => {
    const document = this.state.document
    if (document.blocks.length > 1) {
      //Always keep one block
      const index = document.blocks.findIndex(b => b.id === blockId)
      const newBlocks = [...document.blocks]
      newBlocks.splice(index,1)
      this.setState({
        document: {
          ...document,
          blocks: newBlocks
        },
        focusedBlock: document.blocks[Math.max(0, index - 1)].id
      }, this.saveDocument)
    }
  }

  turnBlockInto = (blockId: string, newType: BlockTypeNames) => {
    const document = this.state.document
    const i = document.blocks.findIndex(b => b.id === blockId);
    if (i >= 0) {
      const oldBlock = document.blocks[i];
      if (oldBlock.type === newType) {
        return
      }
      const block = BlocksController.make(newType)
      if (block) {
        if (oldBlock.isText && block.isText) {
          block.content = oldBlock.content
        }
        const newBlocks = [...document.blocks]
        newBlocks.splice(i,1, block)
        this.setState({
          document: {
            ...document,
            blocks: newBlocks
          },
          focusedBlock: block.id
        }, this.saveDocument)
      }
    }
  }

  render() {
    return (
          <TextEditorContext.Provider value={{
            document: this.state.document,
            setBlockContent: this.setBlockContent,
            insertNewBlockAfter: this.insertNewBlockAfter,
            insertBlockAfter: this.insertBlockAfter,
            focusedBlock: this.state.focusedBlock,
            setFocus: this.setFocus,
            unsetFocus: this.unsetFocus,
            focusPreviousBlock: this.focusPreviousBlock,
            focusNextBlock: this.focusNextBlock,
            deleteBlock: this.deleteBlock,
            turnBlockInto: this.turnBlockInto,
            setTempDoc: this.setTempDoc,
            setTitle: this.setTitle,
            titleBlockId: this.titleBlockId,
            saveDocument: this.saveDocument
          }}>
            {this.props.children}
          </TextEditorContext.Provider>
    );
  }
}

export const useTextEditorContext = () => useContext(TextEditorContext)
export default TextEditorContextProvider
