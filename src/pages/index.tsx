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
  ]);

  return (
    <Layout>
      <SEO title="Home" />
      <form>
        <div className="columns">
          <div className="column">
            {players.map((player, index) => (
              <div className="field has-addons">
                <div className="control">
                  {index +1}
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
            <div id="image-builder">
              <ul className="players">
                {players.map((player) => (
                  <li>{player}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default IndexPage;
