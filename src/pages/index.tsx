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
  const [subs, setSubs] = useState<string[]>(["", "", "", "", "", ""]);
  const [tab, setTab] = useState<number>(0);
  const [colour, setColour] = useState<string>("#08D3F2");

  return (
    <Layout>
      <SEO title="Home" />
      <section className="section">
        <form>
          <div className="columns is-vcentered">
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
                {players.map((player, index) => (
                  <div className="field">
                    <div className="control has-icons-left">
                      <div className="icon">{index + 1}</div>
                      <input
                        className="input"
                        key={`player=${index}`}
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
                <label className="label">Subs</label>
                {subs.map((sub, index) => (
                  <div className="field">
                    <div className="control has-icons-left">
                      <div className="icon">{index + 1}</div>
                      <input
                        className="input"
                        key={`sub-${index}`}
                        value={sub}
                        onChange={event => {
                          setSubs(
                            subs.map((pl, ind) => {
                              return ind === index ? event.target.value : pl;
                            }),
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className={`tab${tab === 2 ? " is-active" : ""}`}>
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
                <label className="label">Lineup</label>
                <ul className="players">
                  {players.map(player => (
                    <li key={`img-player-${player}`}>{player}</li>
                  ))}
                </ul>
                {subs.filter(sub => sub !== "").length >= 1 && (
                  <>
                    <label className="label">Subs</label>
                    <div className="subs">
                      {subs.filter(sub => sub !== "").join(" / ")}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default IndexPage;
