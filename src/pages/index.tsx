import React, { useState } from "react";
import { ChromePicker } from "react-color";

import Layout from "../components/layout";
import SEO from "../components/seo";

type Player = {
  number?: string;
  name?: string;
};

const PlayerField = ({
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

const DisplayPlayer = ({
  player,
  numberColour,
}: {
  player: Player;
  numberColour: string;
}) => (
  <span className="player">
    {player.number !== "" && (
      <span style={{ color: numberColour }} className="player-number">
        {player.number}
      </span>
    )}
    <span className="player-name">{player.name}</span>
  </span>
);

const IndexPage = () => {
  // for changing to 5 a side later on
  const options = {
    players: 11,
    subs: 6,
  };

  const [players, setPlayers] = useState<Player[]>(
    Array.from(Array(options.players)).map(index => ({
      name: "",
      number: index,
    })),
  );
  const [subs, setSubs] = useState<Player[]>(
    Array.from(Array(options.subs)).map(index => ({
      name: "",
      number: index,
    })),
  );
  const [tab, setTab] = useState<number>(0);
  const [primaryColour, setPrimaryColour] = useState<string>("#0A2666");
  const [secondaryColour, setSecondaryColour] = useState<string>("#D6D118");
  const [capitalise, setCapitalise] = useState<boolean>(false);

  const updatePlayer = (player: Player, index: number) => {
    setPlayers([
      ...players.map((value, ind) => (ind === index ? player : value)),
    ]);
  };

  const updateSub = (player: Player, index: number) => {
    setSubs([...subs.map((value, ind) => (ind === index ? player : value))]);
  };

  return (
    <Layout>
      <SEO title="Home" />
      <section className="section">
        <form>
          <div className="columns">
            <div className="column">
              <div className="tabs">
                <ul>
                  <li className={tab === 0 ? "is-active" : undefined}>
                    <a
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        setTab(0);
                      }}
                    >
                      Starting XI
                    </a>
                  </li>
                  <li className={tab === 1 ? "is-active" : undefined}>
                    <a
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        setTab(1);
                      }}
                    >
                      Subs
                    </a>
                  </li>
                  <li className={tab === 2 ? "is-active" : undefined}>
                    <a
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        setTab(2);
                      }}
                    >
                      Styles
                    </a>
                  </li>
                </ul>
              </div>
              <div className={`tab${tab === 0 ? " is-active" : ""}`}>
                <label className="label">Starting XI</label>
                {players.map((player, index) => (
                  <PlayerField
                    key={`player-field-${index}`}
                    player={player}
                    index={index}
                    updatePlayer={updatePlayer}
                  />
                ))}
              </div>
              <div className={`tab${tab === 1 ? " is-active" : ""}`}>
                <label className="label">Subs</label>
                {subs.map((sub, index) => (
                  <PlayerField
                    key={`sub-field-${index}`}
                    player={sub}
                    index={index}
                    updatePlayer={updateSub}
                  />
                ))}
              </div>
              <div className={`tab${tab === 2 ? " is-active" : ""}`}>
                <h4 className="title">Team Colour</h4>
                <label className="label">First Colour</label>
                <ChromePicker
                  onChange={colour => {
                    setPrimaryColour(colour.hex);
                  }}
                  color={primaryColour}
                />
                <label className="label">Second Colour</label>
                <ChromePicker
                  onChange={colour => {
                    setSecondaryColour(colour.hex);
                  }}
                  color={secondaryColour}
                />
                <hr />
                <h4 className="title">Text styles</h4>
                <div className="field">
                  <div className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={capitalise}
                        onChange={() => setCapitalise(!capitalise)}
                      />
                      Capitalise
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div
                id="image-builder"
                style={{ background: primaryColour }}
                className={capitalise ? "is-capitalised" : ""}
              >
                <div className="text">
                  <div className="player-container">
                    <label className="label">Starting XI</label>
                    <ul className="players">
                      {players.map(player => (
                        <li key={`img-player-${player.name}-${player.number}`}>
                          <DisplayPlayer
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
                        .filter(sub => sub.name !== '')
                        .map(sub => (
                          <DisplayPlayer
                            numberColour={secondaryColour}
                            player={sub}
                            key={`img-player-${sub.name}-${sub.number}`}
                          />
                          //@ts-ignore
                        )).reduce((prev, curr) => [prev, ' / ', curr])}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default IndexPage;
