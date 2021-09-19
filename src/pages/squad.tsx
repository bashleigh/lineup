import React, { useState } from "react";
import { useEffect } from "react";
import Layout from "../components/layout";
import { PlayerField } from "../components/player.details";
import { Player } from "../types";
import { v4 as uuid } from "uuid";

const NewPlayer = ({
  open,
  close,
  save,
  players,
}: {
  open: boolean;
  close: () => void;
  save: (player: Player) => void;
  players: Player[];
}) => {
  const [player, setPlayer] = useState<Player>({
    id: uuid(),
    name: "",
    number: "",
    position: [],
  });
  const [errors, setErrors] = useState<{ [s: string]: string }>({});

  useEffect(() => {
    if (
      players
        .map(player => player.number)
        .filter(num => typeof num !== "undefined" && num !== "")
        .includes(player.number)
    ) {
      setErrors({
        ...errors,
        number: `number ${player.number} already assigned`,
      });
    } else {
      // TODO filter number key error
      setErrors({});
    }
  }, [player]);

  return (
    <div className={`modal${open ? " is-active" : ""}`}>
      <div className="modal-background" onClick={close}></div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={close}
      ></button>
      <div className="modal-content">
        <div className="card">
          <div className="card-header">
            <div className="card-content">
              <h1 className="title">Add new Player</h1>
            </div>
          </div>
          <div className="card-content">
            <form
              onSubmit={e => {
                e.preventDefault();
                if (Object.keys(errors).length >= 1) {
                  return;
                }
                const value = player;
                setPlayer({ id: uuid(), name: "", number: "", position: [] });
                save(value);
              }}
            >
              <PlayerField
                index={0}
                errors={errors}
                player={player}
                updatePlayer={player => setPlayer(player)}
              />
              <button className="button is-primary">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const storedPlayers = localStorage.getItem("squad");

    if (storedPlayers) setPlayers(JSON.parse(storedPlayers));
  }, []);

  useEffect(() => {
    localStorage.setItem("squad", JSON.stringify(players));
  }, [players]);

  return (
    <Layout>
      <section className="section">
        <h1 className="title">Squad</h1>
        <button
          className="button is-primary"
          onClick={() => setModalOpen(!modalOpen)}
        >
          New Player
        </button>
        <div className="content">
          {players.map(player => (
            <div className="player-list" key={JSON.stringify(player)}>
              <button
                onClick={() => {
                  setPlayers([
                    ...players.filter(
                      pl =>
                        !(
                          pl.name === player.name && pl.number === player.number
                        ),
                    ),
                  ]);
                }}
                className="button is-ghost"
              >
                X
              </button>{" "}
              {player.number} {player.name}{" "}
              <div className="tags">
                {player.position?.map(pos => (
                  <span
                    key={`${player.id}-${pos}`}
                    className={`tag is-${pos.toLowerCase()}`}
                  >
                    {pos}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <NewPlayer
        players={players}
        open={modalOpen}
        close={() => setModalOpen(!modalOpen)}
        save={player => {
          setPlayers([...players, player]);
          setModalOpen(!modalOpen);
        }}
      />
    </Layout>
  );
};
