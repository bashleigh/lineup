import React from "react";
import { Player } from "./../types";
import { getCorrectTextColor } from "./../utils/textcolor";
import { DisplayPlayer } from "./player.display";
import { background, marbleBackground } from "./background";
import * as tinycolor from "tinycolor2";

export enum ImageLayout {
  STRIPES = "stripes",
  MARBLE = "marble",
}

export const ImageBuilder = ({
  image,
  badge,
  primaryColour,
  secondaryColour,
  capitalise,
  players,
  subs,
  badgeOn,
  layout,
}: {
  image?: string | null | ArrayBuffer;
  badge?: string | null | ArrayBuffer;
  badgeOn: boolean;
  primaryColour: string;
  secondaryColour: string;
  capitalise: boolean;
  players: Player[];
  subs: Player[];
  layout: ImageLayout;
}) => {
  return (
    <div
      id="image-builder"
      style={{
        backgroundColor: tinycolor(primaryColour).darken(20),
        color: getCorrectTextColor(primaryColour),
        backgroundImage: `url("${
          layout === ImageLayout.STRIPES
            ? background(primaryColour)
            : marbleBackground(primaryColour)
        }")`,
      }}
      className={`${capitalise ? "is-capitalised " : ""}is-${layout}`}
    >
      <div
        className="builder-before"
        style={{
          backgroundColor: tinycolor(primaryColour),
        }}
      ></div>
      <div className="text">
        <div className="player-container">
          <label className="label">Starting XI</label>
          <ul className="players">
            {players.map(player => (
              <li key={JSON.stringify(player)}>
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
      <div
        className={`image-container${
          image === null && badge !== null
            ? " has-only-badge"
            : image !== null
            ? " has-image"
            : ""
        }`}
      >
        {typeof image === "string" && (
          <div className="image">
            <img src={image} />
          </div>
        )}
        {badgeOn && typeof badge === "string" && (
          <div className="badge" style={{ background: secondaryColour }}>
            <img src={badge} />
          </div>
        )}
      </div>
    </div>
  );
};
