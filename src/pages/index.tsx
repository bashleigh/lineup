import { ImageBuilder } from "../components/image.builder";
import { PlayerField } from "../components/player.details";
import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { Player } from "./../types";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { barca } from "./../utils/barca";

const IndexPage = () => {
  // for changing to 5 a side later on
  const options = {
    players: 11,
    subs: 6,
  };

  const [players, setPlayers] = useState<Player[]>(barca.players);
  const [subs, setSubs] = useState<Player[]>(barca.subs);
  const [tab, setTab] = useState<number>(0);
  const [primaryColour, setPrimaryColour] = useState<string>(
    barca.primaryColour,
  );
  const [secondaryColour, setSecondaryColour] = useState<string>(
    barca.secondaryColour,
  );
  const [capitalise, setCapitalise] = useState<boolean>(barca.capitalise);
  const [image, setImage] = useState<null | string | ArrayBuffer>(barca.image);
  const [badge, setBadge] = useState<null | string | ArrayBuffer>(barca.badge);

  const updatePlayer = (player: Player, index: number) => {
    setPlayers([
      ...players.map((value, ind) => (ind === index ? player : value)),
    ]);
  };

  const clear = () => {
    setPlayers(
      Array.from(Array(options.players)).map(index => ({
        name: "",
        number: index,
      })),
    );
    setSubs(
      Array.from(Array(options.subs)).map(index => ({
        name: "",
        number: index,
      })),
    );

    setImage(null);
    setBadge(null);
  };

  const updateSub = (player: Player, index: number) => {
    setSubs([...subs.map((value, ind) => (ind === index ? player : value))]);
  };

  let fileReader;

  if (typeof window !== `undefined`) {
    fileReader = new window.FileReader();

    fileReader.onload = () => {
      setImage(fileReader.result);
    };
  }

  let badgeFileReader;

  if (typeof window !== `undefined`) {
    badgeFileReader = new window.FileReader();

    badgeFileReader.onload = () => {
      setBadge(badgeFileReader.result);
    };
  }

  return (
    <Layout>
      <SEO title="Line up Builder" />
      <section className="section">
        <form>
          <div className="columns is-reversed">
            <div className="column">
              <a
                href="#"
                onClick={event => {
                  event.preventDefault();
                  clear();
                }}
              >
                Reset
              </a>
              <ImageBuilder
                primaryColour={primaryColour}
                secondaryColour={secondaryColour}
                players={players}
                subs={subs}
                capitalise={capitalise}
                image={image}
                badge={badge}
              />
            </div>
            <div className="column">
              <div className="tabs">
                <ul>
                  {["Starting XI", "Subs", "Styles", "Image"].map(
                    (tabName, index) => (
                      <li
                        key={`tab-bitton-${tabName}-${index}`}
                        className={tab === index ? "is-active" : undefined}
                      >
                        <a
                          href="#"
                          onClick={event => {
                            event.preventDefault();
                            setTab(index);
                          }}
                        >
                          {tabName}
                        </a>
                      </li>
                    ),
                  )}
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
              <div className={`tab${tab === 3 ? " is-active" : ""}`}>
                <h4 className="title">Images</h4>
                <label className="label">Player</label>
                <div className="file is-boxed">
                  <label className="file-label">
                    <input
                      className="file-input"
                      name="player-image"
                      type="file"
                      onChange={event => {
                        event?.target?.files &&
                          event.target.files.length === 1 &&
                          fileReader &&
                          fileReader.readAsDataURL(event.target.files[0]);
                      }}
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        {/* TODO do I really need fontawesome for one icon? */}
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Choose a image</span>
                    </span>
                  </label>
                </div>
                <label className="label">Badge</label>
                <div className="file is-boxed">
                  <label className="file-label">
                    <input
                      className="file-input"
                      name="badge-image"
                      type="file"
                      onChange={event => {
                        event?.target?.files &&
                          event.target.files.length === 1 &&
                          badgeFileReader &&
                          badgeFileReader.readAsDataURL(event.target.files[0]);
                      }}
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        {/* TODO do I really need fontawesome for one icon? */}
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Choose a image</span>
                    </span>
                  </label>
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
