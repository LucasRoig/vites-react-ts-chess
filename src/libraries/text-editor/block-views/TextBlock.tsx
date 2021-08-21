import React, {KeyboardEvent} from "react";
import {
  BlockTypeNames,
  BulletListBlockModel,
  Heading1BlockModel,
  Heading2BlockModel,
  Heading3BlockModel,
  TextBlockModel
} from "../Models";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";
import {TextEditorContext} from "../TextEditorContext";

class TextBlock extends React.Component<
  { block: TextBlockModel, reference: React.RefObject<HTMLElement>, onChange: (e: ContentEditableEvent) => void, isFocused: boolean }
  , {}> {
  render() {
    const style: any = {
      flexGrow: 2,
      fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif"
    }
    if (this.props.block.content.length === 0) {
      style.color = "rgba(55, 53, 47, 0.4)"
    }
    return <ContentEditable html={this.props.block.content} onChange={this.props.onChange} className={"text-container"}
                            placeholder={"Type '/' to see commands"}
                            innerRef={this.props.reference} style={style}/>;
  }
}

class Heading1Block extends React.Component<
  { block: Heading1BlockModel, reference: React.RefObject<HTMLElement>, onChange: (e: ContentEditableEvent) => void, isFocused: boolean }
  , {}> {
  render() {
    const style: any = {
      flexGrow: 2,
      fontWeight: 600,
      fontSize: "1.875em",
      lineHeight: 1.3,
      fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif"
    }
    if (this.props.block.content.length === 0) {
      style.color = "rgba(55, 53, 47, 0.2)"
    }
    return (
      <div style={{paddingTop: "2em", flexGrow: 2}}>
        <ContentEditable html={this.props.block.content} onChange={this.props.onChange} placeholder="Heading 1" innerRef={this.props.reference} style={style}/>
      </div>
    );
  }
}

class Heading2Block extends React.Component<
  { block: Heading2BlockModel, reference: React.RefObject<HTMLElement>, onChange: (e: ContentEditableEvent) => void, isFocused: boolean }
  , {}> {
  render() {
    const style: any = {
      flexGrow: 2,
      fontWeight: 600,
      fontSize: "1.5em",
      lineHeight: 1.3,
      fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif"
    }
    if (this.props.block.content.length === 0) {
      style.color = "rgba(55, 53, 47, 0.2)"
    }
    return (
      <div style={{paddingTop: "1.4em", flexGrow: 2}}>
        <ContentEditable html={this.props.block.content} onChange={this.props.onChange} placeholder="Heading 2" innerRef={this.props.reference} style={style}/>
      </div>
    )
  }
}

class Heading3Block extends React.Component<
  { block: Heading3BlockModel, reference: React.RefObject<HTMLElement>, onChange: (e: ContentEditableEvent) => void, isFocused: boolean }
  , {}> {
  render() {
    const style: any = {
      flexGrow: 2,
      fontWeight: 600,
      fontSize: "1.25em",
      lineHeight: 1.3,
      fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif"
    }
    if (this.props.block.content.length === 0) {
      style.color = "rgba(55, 53, 47, 0.2)"
    }
    return (
      <div style={{paddingTop: "1em", flexGrow: 2}}>
        <ContentEditable html={this.props.block.content} onChange={this.props.onChange}
                              placeholder="Heading 3" innerRef={this.props.reference} style={style}/>
      </div>
    );
  }
}

class BulletListBlock extends React.Component<
  { block: BulletListBlockModel, reference: React.RefObject<HTMLElement>, onChange: (e: ContentEditableEvent) => void, isFocused: boolean }
  , {}> {

  static contextType = TextEditorContext
  context!: React.ContextType<typeof TextEditorContext>
  keyboardHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && this.props.block.content.length === 0) {
      this.context.turnBlockInto(this.props.block.id, BlockTypeNames.Text)
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "Enter") {
      this.context.insertBlockAfter(this.props.block.id, BlockTypeNames.BulletList)
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    const style: any = {
      flexGrow: 2,
      fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif"
    }
    if (this.props.block.content.length === 0) {
      style.color = "rgba(55, 53, 47, 0.4)"
    }
    return (
      <div style={{flexGrow: 2}}>
        <div style={{display: "flex", width: "100%", alignItems: "center"}}>
          <div style={{height: "8px", width: "8px", backgroundColor: "black", marginRight:"1em", borderRadius:"30px"}}/>
          <ContentEditable html={this.props.block.content} onChange={this.props.onChange} onKeyDown={this.keyboardHandler}
                           placeholder="List" innerRef={this.props.reference} style={style}/>
        </div>
      </div>
    );
  }
}

export {
  TextBlock,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  BulletListBlock
}
