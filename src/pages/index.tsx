import React, { useState } from "react";
import { ChromePicker } from "react-color";

import Layout from "../components/layout";
import SEO from "../components/seo";

const IndexPage = () => {
  const [players, setPlayers] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [tab, setTab] = useState<number>(0);
  const [colour, setColour] = useState<string>("#F1E5B2");

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
                      Players
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
                      Styles
                    </a>
                  </li>
                </ul>
              </div>
              <div className={`tab${tab === 0 ? " is-active" : ""}`}>
                {players.map((player, index) => (
                  <div className="field has-addons">
                    <div className="control">{index + 1}</div>
                    <div className="control">
                      <input
                        className="input"
                        key={index}
                        value={player}
                        onChange={event => {
                          setPlayers(
                            players.map((pl, ind) => {
                              return ind === index ? event.target.value : pl;
                            }),
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className={`tab${tab === 1 ? " is-active" : ""}`}>
                <label className="label">Team Colour</label>
                <ChromePicker
                  onChange={colour => {
                    setColour(colour.hex);
                  }}
                  color={colour}
                />
              </div>
            </div>
            <div className="column">
              <div id="image-builder" style={{ background: colour }}>
                <ul className="players">
                  {players.map(player => (
                    <li>{player}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default IndexPage;
