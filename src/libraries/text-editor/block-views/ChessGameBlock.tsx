import React from "react";
import {Square} from "../../chess";
import {ChessBoardWithRules} from "../../../shared-components/chessboard/ChessboardWithRules";
import {NotationPanel} from "../../../shared-components/notation-panel/NotationPanel";
import {ChessGameBlockModel} from "../Models";
import {TextEditorContext} from "../TextEditorContext";
import {
  NormalizedFirstPosition,
  NormalizedGame,
  NormalizedGameHelper,
  NormalizedGameMutator,
  NormalizedPosition
} from "../../chess/NormalizedGame";

interface ChessGameBlockProps {
  block: ChessGameBlockModel
}

interface ChessGameBlockState {
  game: NormalizedGame,
  currentPos: NormalizedFirstPosition
}

class ChessGameBlock extends React.Component<ChessGameBlockProps, ChessGameBlockState> {
  static contextType = TextEditorContext
  context!: React.ContextType<typeof TextEditorContext>
  constructor(props: ChessGameBlockProps) {
    super(props);
    console.log(this.props.block.game)
    this.state = {
      game: this.props.block.game,
      currentPos: NormalizedGameHelper.getFirsPosition(this.props.block.game)
    }
  }

  onMove = (from: Square, to: Square, san: string, fen: string) => {
    const r = NormalizedGameMutator.handleMove(this.state.game, this.state.currentPos, from, to, san, fen);
    if (r.hasChanged) {
      this.props.block.game = r.game
      this.setState({
        currentPos: r.posToGo,
        game: r.game
      }, () => this.context.saveDocument())
    } else {
      this.setState({
        currentPos: r.posToGo
      })
    }
  }

  goToPosition = (position: NormalizedPosition) => {
    this.setState({
      currentPos: position
    })
  }

  render() {
    return (
      <div style={{paddingTop: "2em", paddingBottom: "2em"}}>
      <div style={{display: "flex", border: "1px solid #B5B5B5", paddingBottom: ".75rem"}}>
        <ChessBoardWithRules fen={this.state.currentPos.fen} onMove={this.onMove}/>
        <div style={{backgroundColor: "white", width: "300px", marginLeft: "1rem"}}>
          <NotationPanel game={this.state.game} currentPositionIndex={this.state.currentPos.index} onPosClick={this.goToPosition}/>
        </div>
      </div>
      </div>
    );
  }
}

export {
  ChessGameBlock
}
