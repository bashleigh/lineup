import React from "react";
import { Player } from "./../types";
import { getCorrectTextColor } from "./../utils/textcolor";
import { DisplayPlayer } from "./player.display";

export const ImageBuilder = ({
  image,
  primaryColour,
  secondaryColour,
  capitalise,
  players,
  subs,
}: {
  image?: string | null | ArrayBuffer;
  primaryColour: string;
  secondaryColour: string;
  capitalise: boolean;
  players: Player[];
  subs: Player[];
}) => (
  <div
    id="image-builder"
    style={{
      background: primaryColour,
      color: getCorrectTextColor(primaryColour),
    }}
    className={capitalise ? "is-capitalised" : ""}
  >
    <div className="text">
      <div className="player-container">
        <label className="label">Starting XI</label>
        <ul className="players">
          {players.map(player => (
            <li>
              <DisplayPlayer
                type="player"
                numberColour={secondaryColour}
                player={player}
              />
            </li>
          ))}
        </ul>
      </div>
      {subs.filter(sub => sub.name !== "").length >= 1 && (
        <div className="sub-container">
          <label className="label">Subs</label>
          <div className="subs">
            {subs
              .filter(sub => sub.name !== "")
              .map(sub => (
                <DisplayPlayer
                  type="sub"
                  numberColour={secondaryColour}
                  player={sub}
                  key={`img-player-${sub.name}-${sub.number}`}
                />
              ))
              //@ts-ignore
              .reduce((prev, curr) => [prev, " / ", curr])}
          </div>
        </div>
      )}
    </div>
    <div className="image">
      {typeof image === "string" && <img src={image} />}
    </div>
  </div>
);
