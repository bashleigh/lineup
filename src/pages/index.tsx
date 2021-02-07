import React, { useState } from "react";

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
    "",
    "",
  ]);

  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <form>
        <div className="columns">
          <div className="column">
            {players.map((player, index) => (
              <div className="field has-addons">
                <div className="control">
                  {index}
                </div>
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
          <div className="column">
            {players.map((player) => (
              <div>{player}</div>
            ))}
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default IndexPage;
