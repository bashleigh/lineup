import React from "react";
import { Player } from "./../types";

export const DisplayPlayer = ({
  player,
  numberColour,
  type,
}: {
  player: Player;
  numberColour: string;
  type: string;
}) => (
  <span className={`player player-${type}`}>
    {player.number !== "" && (
      <span style={{ color: numberColour }} className="player-number">
        {player.number}
      </span>
    )}
    <span className="player-name">{player.name}</span>
  </span>
);
