import { ImageBuilder } from "../components/image.builder";
import React, { useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import { Player } from "./../types";
import { toPng } from "html-to-image";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { barca } from "./../utils/barca";
import { Droppable, DragDropContext, Draggable } from "react-beautiful-dnd";

const PlayerItem = ({ player, index }: { player: Player; index: number }) => {
  return (
    <Draggable
      key={player.id}
      draggableId={player.id}
      index={index}
    >
      {provided => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {player.number} {player.name}
        </li>
      )}
    </Draggable>
  );
};

const SquadSelector = () => {
  const startingId = "starting";
  const subsId = "subs";
  const squadId = "squad";
  const [setup, setSetup] = useState<{
    squad: Player[],
    starting: Player[],
    subs: Player[],
  }>({
    squad: [],
    starting: [],
    subs: [],
  })

  useEffect(() => {
    const storedPlayers = localStorage.getItem("squad");

    if (storedPlayers) setSetup({
      squad: JSON.parse(storedPlayers),
      starting: [],
      subs: [],
    });
  }, []);

  const move = (source, destination, droppableSource, droppableDestination): {
    [s: string]: Player[],
  } => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const reorder = (list: Player[], startIndex, endIndex): Player[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

  const dragEnd = event => {
    console.log("event", event);

    const {source, destination} = event

    if (event.source.droppableId === event.destination.droppableId) {
      const result = reorder(event.source.droppableId === squadId ? setup.squad : event.source.droppableId === startingId ? setup.starting : setup.subs, source.index, destination.index)

      setSetup({
        ...setup,
        [event.source.droppableId === squadId ? 'squad' : event.source.droppableId === startingId ? 'starting' : 'subs']: result,
      })
      return
    }

    let result

    switch (event.source.droppableId) {
      case squadId:

        result = move(setup.squad, event.destination.droppableId === subsId ? setup.subs : setup.starting, source, destination)
        break;
      case startingId:
        result = move(setup.starting, event.destination.droppableId === subsId ? setup.subs : setup.squad, source, destination)
        break;
      case subsId:
        result = move(setup.subs, event.destination.droppableId === squadId ? setup.squad : setup.starting, source, destination)
        break;
    }

    setSetup({
      ...setup,
      ...result,
    });
    
  };

  return (
    <DragDropContext onDragEnd={dragEnd}>
      <div className="columns">
        <div className="column">
          <label>Squad</label>
          <Droppable droppableId={squadId}>
            {provided => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {setup.squad.map((player, index) => (
                  <PlayerItem
                    key={player.id}
                    index={index}
                    player={player}
                  />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
        <div className="column">
          <label>Starting XI</label>
          <Droppable droppableId={startingId}>
            {provided => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {setup.starting.map((player, index) => (
                  <PlayerItem
                    key={player.id}
                    index={index}
                    player={player}
                  />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <label>Subs</label>
          <Droppable droppableId={subsId}>
            {provided => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {setup.subs.map((player, index) => (
                  <PlayerItem
                    key={player.id}
                    index={index}
                    player={player}
                  />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
};

const Builder = () => {
  // for changing to 5 a side later on
  const options = {
    players: 11,
    subs: 6,
  };

  const [squad, setSquad] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [subs, setSubs] = useState<Player[]>([]);
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

  useEffect(() => {
    const storedPlayers = localStorage.getItem("squad");

    if (storedPlayers) setSquad(JSON.parse(storedPlayers));
  }, []);

  const clear = () => {
    setSelectedPlayers([]);
    setSubs([]);

    setImage(null);
    setBadge(null);
  };

  let fileReader: FileReader;

  if (typeof window !== `undefined`) {
    fileReader = new window.FileReader();

    fileReader.onload = () => {
      setImage(fileReader.result);
    };
  }

  let badgeFileReader: FileReader;

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
              <div className="level">
                <div className="level-left">
                  <a
                    href="#"
                    onClick={event => {
                      event.preventDefault();
                      clear();
                    }}
                  >
                    Reset
                  </a>
                </div>
                <div className="level-left">
                  <button
                    className="button is-primary"
                    onClick={event => {
                      event.preventDefault();
                      const element = document.getElementById("image-builder");
                      element &&
                        toPng(element).then(url => {
                          const downloadLink = document.createElement("a");
                          downloadLink.href = url;
                          downloadLink.download = "LineUp";
                          downloadLink.click();
                        });
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
              <ImageBuilder
                primaryColour={primaryColour}
                secondaryColour={secondaryColour}
                players={selectedPlayers}
                subs={subs}
                capitalise={capitalise}
                image={image}
                badge={badge}
              />
            </div>
            <div className="column">
              <div className="tabs">
                <ul>
                  {["Squad", "Styles", "Images"].map((tabName, index) => (
                    <li
                      key={`tab-button-${tabName}-${index}`}
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
                  ))}
                </ul>
              </div>
              <div className={`tab${tab === 0 ? " is-active" : ""}`}>
                <label className="label">Starting XI</label>
                <SquadSelector />
              </div>
              <div className={`tab${tab === 1 ? " is-active" : ""}`}>
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
              <div className={`tab${tab === 2 ? " is-active" : ""}`}>
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
                <a
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    setImage(null);
                  }}
                >
                  Remove
                </a>
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
                <a
                  href="#"
                  onClick={event => {
                    event.preventDefault();
                    setBadge(null);
                  }}
                >
                  Remove
                </a>
              </div>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default Builder;
