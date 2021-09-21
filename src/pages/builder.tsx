import {
  ImageBuilder,
  ImageLayout,
  ImageStyle,
} from "../components/image.builder";
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
    <Draggable key={player.id} draggableId={player.id} index={index}>
      {provided => (
        <li
          className="player-info"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="columns">
            <div className="column">
              <span className="player-number">{player.number}</span>{" "}
              {player.name}
            </div>
            <div className="column">
              <div className="tags">
                {player.position?.map(tag => (
                  <div
                    className={`tag is-primary is-${tag.toLowerCase()}`}
                    key={`${player.id}-${tag}`}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};

type PlayerSetup = {
  squad: Player[];
  starting: Player[];
  subs: Player[];
};

const SquadSelector = ({
  updateSquad,
}: {
  updateSquad: (squad: PlayerSetup) => void;
}) => {
  const startingId = "starting";
  const subsId = "subs";
  const squadId = "squad";
  const [setup, setSetup] = useState<PlayerSetup>({
    squad: [],
    starting: [],
    subs: [],
  });

  useEffect(() => {
    const storedPlayers = localStorage.getItem("squad");

    if (storedPlayers)
      setSetup({
        squad: JSON.parse(storedPlayers),
        starting: [],
        subs: [],
      });
  }, []);

  useEffect(() => {
    updateSquad(setup);
  }, [setup]);

  const move = (
    source,
    destination,
    droppableSource,
    droppableDestination,
  ): {
    [s: string]: Player[];
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
    const { source, destination } = event;

    if (!destination) {
      return;
    }

    if (event.source.droppableId === event.destination.droppableId) {
      const result = reorder(
        event.source.droppableId === squadId
          ? setup.squad
          : event.source.droppableId === startingId
          ? setup.starting
          : setup.subs,
        source.index,
        destination.index,
      );

      setSetup({
        ...setup,
        [event.source.droppableId === squadId
          ? "squad"
          : event.source.droppableId === startingId
          ? "starting"
          : "subs"]: result,
      });
      return;
    }

    let result;

    switch (event.source.droppableId) {
      case squadId:
        result = move(
          setup.squad,
          event.destination.droppableId === subsId
            ? setup.subs
            : setup.starting,
          source,
          destination,
        );
        break;
      case startingId:
        result = move(
          setup.starting,
          event.destination.droppableId === subsId ? setup.subs : setup.squad,
          source,
          destination,
        );
        break;
      case subsId:
        result = move(
          setup.subs,
          event.destination.droppableId === squadId
            ? setup.squad
            : setup.starting,
          source,
          destination,
        );
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
          <label className="label">Squad</label>
          <Droppable droppableId={squadId}>
            {provided => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="droppable-location"
              >
                {setup.squad.map((player, index) => (
                  <PlayerItem key={player.id} index={index} player={player} />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
        <div className="column">
          <label className="label">Starting XI</label>
          <Droppable droppableId={startingId}>
            {provided => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="droppable-location"
              >
                {setup.starting.map((player, index) => (
                  <PlayerItem key={player.id} index={index} player={player} />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <label className="label">Subs</label>
          <Droppable droppableId={subsId}>
            {provided => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="droppable-location"
              >
                {setup.subs.map((player, index) => (
                  <PlayerItem key={player.id} index={index} player={player} />
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
  const [setup, setSetup] = useState<PlayerSetup>({
    starting: [],
    subs: [],
    squad: [],
  });
  const [tab, setTab] = useState<number>(0);

  const [options, setOptions] = useState<{
    primaryColour: string;
    secondaryColour: string;
    image: null | string | ArrayBuffer;
    badge: null | string | ArrayBuffer;
    badgeOn: boolean;
    layout: ImageLayout;
    style: ImageStyle;
    lineupText: boolean;
    capitalise: boolean;
  }>({
    primaryColour: barca.primaryColour,
    secondaryColour: barca.secondaryColour,
    image: barca.image,
    badge: barca.badge,
    badgeOn: true,
    layout: ImageLayout.STRIPES,
    style: ImageStyle.SIDE,
    lineupText: true,
    capitalise: true,
  });

  useEffect(() => {
    const builderOptions = localStorage.getItem("builderOptions");

    if (builderOptions) setOptions(JSON.parse(builderOptions));
  }, []);

  useEffect(() => {
    localStorage.setItem("builderOptions", JSON.stringify(options));
  }, [options]);

  const clear = () => {
    setSetup({
      squad: [],
      starting: [],
      subs: [],
    });

    setOptions({
      ...options,
      image: null,
      badge: null,
    });
  };

  let fileReader: FileReader;

  if (typeof window !== `undefined`) {
    fileReader = new window.FileReader();

    fileReader.onload = () => {
      setOptions({
        ...options,
        image: fileReader.result,
      });
    };
  }

  let badgeFileReader: FileReader;

  if (typeof window !== `undefined`) {
    badgeFileReader = new window.FileReader();

    badgeFileReader.onload = () => {
      setOptions({
        ...options,
        badge: fileReader.result,
      });
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
                primaryColour={options.primaryColour}
                secondaryColour={options.secondaryColour}
                players={setup.starting}
                subs={setup.subs}
                capitalise={options.capitalise}
                image={options.image}
                badge={options.badge}
                badgeOn={options.badgeOn}
                layout={options.layout}
                style={options.style}
                lineupText={options.lineupText}
              />
            </div>
            <div className="column">
              <div className="tabs">
                <ul>
                  {["Squad", "Styles", "Images", "Layouts"].map(
                    (tabName, index) => (
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
                    ),
                  )}
                </ul>
              </div>
              <div className={`tab${tab === 0 ? " is-active" : ""}`}>
                <SquadSelector
                  updateSquad={squad => {
                    setSetup(squad);
                  }}
                />
              </div>
              <div className={`tab${tab === 1 ? " is-active" : ""}`}>
                <h4 className="title">Team Colour</h4>
                <label className="label">First Colour</label>
                <ChromePicker
                  onChange={colour => {
                    setOptions({
                      ...options,
                      primaryColour: colour.hex,
                    });
                  }}
                  color={options.primaryColour}
                />
                <label className="label">Second Colour</label>
                <ChromePicker
                  onChange={colour => {
                    setOptions({
                      ...options,
                      secondaryColour: colour.hex,
                    });
                  }}
                  color={options.secondaryColour}
                />
                <hr />
                <h4 className="title">Text styles</h4>
                <div className="field">
                  <div className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={options.capitalise}
                        onChange={() =>
                          setOptions({
                            ...options,
                            capitalise: !options.capitalise,
                          })
                        }
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
                    setOptions({
                      ...options,
                      image: null,
                    });
                  }}
                >
                  Remove
                </a>
                <label className="label">Badge</label>
                <label>
                  Show Badge
                  <input
                    name="badge-on"
                    type="radio"
                    checked={options.badgeOn}
                    onClick={() =>
                      setOptions({
                        ...options,
                        badgeOn: !options.badgeOn,
                      })
                    }
                  />
                </label>
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
                    setOptions({
                      ...options,
                      image: null,
                    });
                  }}
                >
                  Remove
                </a>
              </div>
              <div className={`tab${tab === 3 ? " is-active" : ""}`}>
                <h4 className="title">Layout</h4>
                <label className="label">Background Type</label>
                <label className="radio">
                  Stripes
                  <input
                    name="layout"
                    type="radio"
                    checked={options.layout === ImageLayout.STRIPES}
                    onClick={() =>
                      setOptions({ ...options, layout: ImageLayout.STRIPES })
                    }
                  />
                </label>
                <label className="radio">
                  Marble
                  <input
                    name="layout"
                    type="radio"
                    checked={options.layout === ImageLayout.MARBLE}
                    onClick={() =>
                      setOptions({ ...options, layout: ImageLayout.MARBLE })
                    }
                  />
                </label>
                <label className="label">Style</label>
                <label className="radio">
                  Bordered
                  <input
                    name="image-style"
                    type="radio"
                    checked={options.style === ImageStyle.BORDERED}
                    onClick={() =>
                      setOptions({ ...options, style: ImageStyle.BORDERED })
                    }
                  />
                </label>
                <label className="radio">
                  Side
                  <input
                    name="image-style"
                    type="radio"
                    checked={options.style === ImageStyle.SIDE}
                    onClick={() =>
                      setOptions({ ...options, style: ImageStyle.SIDE })
                    }
                  />
                </label>

                <br />
                <label className="label">Properties</label>
                {options.style === ImageStyle.BORDERED && (
                  <label className="checkbox">
                    LINE UP text
                    <input
                      name="lineup-text"
                      type="checkbox"
                      checked={options.lineupText}
                      onClick={() =>
                        setOptions({
                          ...options,
                          lineupText: !options.lineupText,
                        })
                      }
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default Builder;
