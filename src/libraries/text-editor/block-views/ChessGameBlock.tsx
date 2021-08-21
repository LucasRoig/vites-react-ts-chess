import React from "react";
import {Game, Position, Square} from "../../chess";
import {FirstPosition, newGame} from "../../chess/Game";
import {ChessBoardWithRules} from "../../../shared-components/chessboard/ChessboardWithRules";
import {NotationPanel} from "../../../shared-components/notation-panel/NotationPanel";
import {GameController} from "../../chess/GameController";
import {ChessGameBlockModel} from "../Models";
import {TextEditorContext} from "../TextEditorContext";

interface ChessGameBlockProps {
  block: ChessGameBlockModel
}

interface ChessGameBlockState {
  game: Game,
  currentPos: FirstPosition
}

class ChessGameBlock extends React.Component<ChessGameBlockProps, ChessGameBlockState> {
  static contextType = TextEditorContext
  context!: React.ContextType<typeof TextEditorContext>
  constructor(props: ChessGameBlockProps) {
    super(props);
    console.log(this.props.block.game)
    this.state = {
      game: this.props.block.game,
      currentPos: this.props.block.game.firstPosition
    }
  }

  onMove = (from: Square, to: Square, san: string, fen: string) => {
    const {gameHasChanged, posToGo} = GameController.handleMove(this.state.game, this.state.currentPos, from, to, san, fen)
    this.setState({
      currentPos: posToGo
    }, () => {
      if (gameHasChanged) {
        this.context.saveDocument()
      }
    })
  }

  goToPosition = (position: Position) => {
    const pos = GameController.getPosition(this.state.game, position);
    if (pos) {
      this.setState({
        currentPos: pos
      })
    }
  }

  render() {
    return (
      <div style={{display: "flex", border: "1px solid #B5B5B5", paddingBottom: ".75rem"}}>
        <ChessBoardWithRules fen={this.state.currentPos.fen} onMove={this.onMove}/>
        <div style={{backgroundColor: "white", width: "300px", marginLeft: "1rem"}}>
          <NotationPanel game={this.state.game} currentPositionIndex={this.state.currentPos.index} onPosClick={this.goToPosition}/>
        </div>
      </div>
    );
  }
}

export {
  ChessGameBlock
}
