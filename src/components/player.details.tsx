import React from "react";
import { MultiSelect } from "react-multi-select-component";
import { Player, Position } from "./../types";

export const PlayerField = ({
  player,
  index,
  updatePlayer,
  errors,
}: {
  player?: Player;
  index: number;
  updatePlayer: (player: Player, index: number) => void;
  errors: {[s: string]: string},
}) => (
  <div className="field has-addons">
    <div className="control">
      <label className="help">Number</label>
      {console.log('error? ', Object.keys(errors))}
      <input
        className={`input${Object.keys(errors).includes('number') ? ' is-danger' : ''}`}
        value={player ? player.number : ""}
        onChange={event => {
          updatePlayer(
            {
              ...player,
              number: event.target.value,
            },
            index,
          );
        }}
      />
      {Object.keys(errors).includes('number') && <p className="help is-danger">{errors.number}</p>}
    </div>
    <div className="control">
      <label className="help">Position</label>
      <div className="select">
      <MultiSelect
        options={Object.values(Position).map(pos => ({label: pos, value: pos}))}
        value={player?.position ? player.position.map(pos => ({label: pos, value: pos})) : []}
        onChange={(positions) => {
          console.log('pos', positions)
          updatePlayer({
            ...player,
            position: [
              ...positions.map(pos => pos.value)
            ],
          }, index)
        }}
        labelledBy="Select"
      />
      </div>
    </div>
    <div className="control is-expanded">
      <label className="help">Surname</label>
      <input
        className="input"
        value={player ? player.name : ""}
        onChange={event => {
          updatePlayer(
            {
              ...player,
              name: event.target.value,
            },
            index,
          );
        }}
      />
    </div>
  </div>
);
