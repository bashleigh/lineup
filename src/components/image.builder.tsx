import React from "react";
import { Player } from "./../types";
import { getCorrectTextColor } from "./../utils/textcolor";
import { DisplayPlayer } from "./player.display";
import { background } from "./background";
import * as tinycolor from "tinycolor2";

export const ImageBuilder = ({
  image,
  badge,
  primaryColour,
  secondaryColour,
  capitalise,
  players,
  subs,
}: {
  image?: string | null | ArrayBuffer;
  badge?: string | null | ArrayBuffer;
  primaryColour: string;
  secondaryColour: string;
  capitalise: boolean;
  players: Player[];
  subs: Player[];
}) => (
  <div
    id="image-builder"
    style={{
      backgroundColor: tinycolor(primaryColour).darken(20),
      color: getCorrectTextColor(primaryColour),
      backgroundImage: `url("${background(primaryColour)}")`,
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
    <div className="image-container">
      {typeof badge === "string" && (
        <div className="badge" style={{ background: secondaryColour }}>
          <img src={badge} />
        </div>
      )}
      {typeof image === "string" && (
        <div className="image">
          <img src={image} />
        </div>
      )}
    </div>
  </div>
);
