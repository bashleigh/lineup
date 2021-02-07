import React from "react";
import { Player } from "types";

export const PlayerField = ({
  player,
  index,
  updatePlayer,
}: {
  player?: Player;
  index: number;
  updatePlayer: (player: Player, index: number) => void;
}) => (
  <div className="field has-addons">
    <div className="control">
      <label className="help">Number</label>
      <input
        className="input"
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
