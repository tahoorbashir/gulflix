import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/styles/Watch.module.scss";
import { setContinueWatching } from "@/Utils/continueWatching";
import { toast } from "sonner";
import { IoReturnDownBack } from "react-icons/io5";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { BsHddStack, BsHddStackFill } from "react-icons/bs";
import axiosFetch from "@/Utils/fetchBackend";
import WatchDetails from "@/components/WatchDetails";
import Player from "@/components/Artplayer";

const Watch = () => {
  const params = useSearchParams();
  const { back, push } = useRouter();

  const [type, setType] = useState<string | null>("");
  const [id, setId] = useState<any>();
  const [season, setSeason] = useState<any>();
  const [episode, setEpisode] = useState<any>();
  const [minEpisodes, setMinEpisodes] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(2);
  const [maxSeason, setMaxSeason] = useState(1);
  const [nextSeasonMinEpisodes, setNextSeasonMinEpisodes] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchDetails, setWatchDetails] = useState(false);
  const [data, setdata] = useState<any>();
  const [seasondata, setseasonData] = useState<any>();
  const [source, setSource] = useState("EMB"); // ✅ default changed from SUP → EMB
  const [embedMode, setEmbedMode] = useState<any>();
  const [nonEmbedURL, setNonEmbedURL] = useState<any>("");
  const [nonEmbedSources, setNonEmbedSources] = useState<any>("");
  const [nonEmbedCaptions, setnonEmbedCaptions] = useState<any>();
  const [nonEmbedFormat, setnonEmbedFormat] = useState<any>();

  const nextBtn: any = useRef(null);
  const backBtn: any = useRef(null);
  const moreBtn: any = useRef(null);

  if (type === null && params.get("id") !== null) setType(params.get("type"));
  if (id === null && params.get("id") !== null) setId(params.get("id"));
  if (season === null && params.get("season") !== null)
    setSeason(params.get("season"));
  if (episode === null && params.get("episode") !== null)
    setEpisode(params.get("episode"));

  useEffect(() => {
    if (
      localStorage.getItem("GulFlixStreamEmbedMode") !== undefined &&
      localStorage.getItem("GulFlixStreamEmbedMode") !== null
    )
      setEmbedMode(
        JSON.parse(localStorage.getItem("GulFlixStreamEmbedMode") || "false"),
      );
    else setEmbedMode(false);

    const latestAgg: any = localStorage.getItem("GulFlixStreamLatestAgg");
    if (latestAgg !== null && latestAgg !== undefined) setSource(latestAgg);

    setLoading(true);
    setType(params.get("type"));
    setId(params.get("id"));
    setSeason(params.get("season"));
    setEpisode(params.get("episode"));
    setContinueWatching({ type: params.get("type"), id: params.get("id") });

    const fetch = async () => {
      const res: any = await axiosFetch({ requestID: `${type}Data`, id: id });
      setdata(res);
      setMaxSeason(res?.number_of_seasons);
      const seasonData = await axiosFetch({
        requestID: `tvEpisodes`,
        id: id,
        season: season,
      });
      setseasonData(seasonData);
      seasonData?.episodes?.length > 0 &&
        setMaxEpisodes(
          seasonData?.episodes[seasonData?.episodes?.length - 1]
            ?.episode_number,
        );
      setMinEpisodes(seasonData?.episodes[0]?.episode_number);
      if (parseInt(episode) >= maxEpisodes - 1) {
        var nextseasonData = await axiosFetch({
          requestID: `tvEpisodes`,
          id: id,
          season: parseInt(season) + 1,
        });
        nextseasonData?.episodes?.length > 0 &&
          setNextSeasonMinEpisodes(nextseasonData?.episodes[0]?.episode_number);
      }
    };
    if (type === "tv") fetch();

    const handleKeyDown = (event: any) => {
      if (event.shiftKey && event.key === "N") {
        event.preventDefault();
        nextBtn?.current.click();
      } else if (event.shiftKey && event.key === "P") {
        event.preventDefault();
        backBtn?.current.click();
      } else if (event.shiftKey && event.key === "M") {
        event.preventDefault();
        moreBtn?.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [params, id, season, episode]);

  useEffect(() => {
    if (embedMode !== undefined && embedMode !== null)
      localStorage.setItem("GulFlixStreamEmbedMode", embedMode);
  }, [embedMode]);

  useEffect(() => {
    let autoEmbedMode: NodeJS.Timeout;
    if (embedMode === false && id !== undefined && id !== null) {
      const fetch = async () => {
        const res: any = await axiosFetch({
          requestID: `${type}VideoProvider`,
          id: id,
          season: season,
          episode: episode,
        });

        if (res?.data?.format == "hls") setEmbedMode(true);

        if (res?.data?.sources?.length > 0) {
          setNonEmbedSources(res?.data?.sources);
          res?.data?.sources?.length > 0
            ? setNonEmbedURL(res?.data?.sources[0]?.url)
            : null;
          setnonEmbedCaptions(res?.data?.captions);
          setnonEmbedFormat(res?.data?.format);
          clearTimeout(autoEmbedMode);
        } else {
          autoEmbedMode = setTimeout(() => setEmbedMode(true), 10000);
        }
      };
      fetch();
    }
  }, [params, id, season, episode, embedMode]);

  function handleBackward() {
    if (episode > minEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) - 1}`,
      );
  }
  function handleForward() {
    if (episode < maxEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) + 1}`,
      );
    else if (parseInt(season) + 1 <= maxSeason)
      push(
        `/watch?type=tv&id=${id}&season=${parseInt(season) + 1}&episode=${nextSeasonMinEpisodes}`,
      );
  }

  // ✅ ACTIVE ENV VARIABLES
  const STREAM_URL_VID = process.env.NEXT_PUBLIC_STREAM_URL_VID;
  const STREAM_URL_EMB = process.env.NEXT_PUBLIC_STREAM_URL_EMB;
  const STREAM_URL_ANY = process.env.NEXT_PUBLIC_STREAM_URL_ANY;
  const STREAM_URL_NEXT = process.env.NEXT_PUBLIC_STREAM_URL_NEXT;
  // ❌ COMMENTED SERVERS
  const STREAM_URL_AGG = process.env.NEXT_PUBLIC_STREAM_URL_AGG;
  // const STREAM_URL_PRO = process.env.NEXT_PUBLIC_STREAM_URL_PRO;
  // const STREAM_URL_MULTI = process.env.NEXT_PUBLIC_STREAM_URL_MULTI;
  // const STREAM_URL_SUP = process.env.NEXT_PUBLIC_STREAM_URL_SUP;
  // const STREAM_URL_CLUB = process.env.NEXT_PUBLIC_STREAM_URL_CLUB;
  // const STREAM_URL_SMASH = process.env.NEXT_PUBLIC_STREAM_URL_SMASH;
  // const STREAM_URL_ONE = process.env.NEXT_PUBLIC_STREAM_URL_ONE;
  // const STREAM_URL_WEB = process.env.NEXT_PUBLIC_STREAM_URL_WEB;

  return (
    <div className={styles.watch}>
      <div onClick={() => back()} className={styles.backBtn}>
        <IoReturnDownBack
          data-tooltip-id="tooltip"
          data-tooltip-content="go back"
        />
      </div>

      <div className={styles.episodeControl}>
        {type === "tv" ? (
          <>
            <div ref={backBtn} onClick={() => episode > 1 && handleBackward()}>
              <FaBackwardStep
                className={`${episode <= minEpisodes ? styles.inactive : null}`}
              />
            </div>
            <div
              ref={nextBtn}
              onClick={() =>
                (episode < maxEpisodes || parseInt(season) + 1 <= maxSeason) &&
                handleForward()
              }
            >
              <FaForwardStep
                className={`${episode >= maxEpisodes && season >= maxSeason ? styles.inactive : null}`}
              />
            </div>
          </>
        ) : null}
        <div ref={moreBtn} onClick={() => setWatchDetails(!watchDetails)}>
          {watchDetails ? <BsHddStackFill /> : <BsHddStack />}
        </div>
      </div>

      {watchDetails && (
        <WatchDetails
          id={id}
          type={type}
          data={data}
          season={season}
          episode={episode}
          setWatchDetails={setWatchDetails}
        />
      )}

      <div className={styles.watchSelects}>
        {embedMode === true && (
          <select
            name="source"
            id="source"
            className={styles.source}
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              localStorage.setItem("GulFlixStreamLatestAgg", e.target.value);
            }}
          >
            <option value="EMB">Server : 1 (ads)</option>
            <option value="VID">Server : 2 (ads)</option>
            <option value="ANY">Server : 3 (Multi-Server)</option>
            <option value="AGG">Server : 4(Hindi dubbed available)</option>
            <option value="NEXT">Server: 5(Multi language available)</option>
            {/* <option value="PRO">Aggregator : 3 (Best-Server)</option> */}
            {/* <option value="MULTI">Aggregator : 5 (Fast-Server)</option> */}
            {/* <option value="SUP">Aggregator : 6 (Multi/Most-Server)</option> */}
            {/* <option value="CLUB">Aggregator : 7</option> */}
            {/* <option value="SMASH">Aggregator : 8</option> */}
            {/* <option value="ONE">Aggregator : 9</option> */}
            {/* <option value="WEB">Aggregator : 11 (Ad-Free)</option> */}
          </select>
        )}

        {embedMode === false && (
          <select
            name="embedModesource"
            id="embedModesource"
            className={styles.embedMode}
            value={nonEmbedURL}
            onChange={(e) => setNonEmbedURL(e.target.value)}
          >
            <option value="" disabled selected>
              servers
            </option>
            {nonEmbedSources?.length > 0 &&
              nonEmbedSources?.map((ele: any) => (
                <option value={ele?.url} defaultChecked>
                  {ele?.source} ({ele?.quality})
                </option>
              ))}
          </select>
        )}

        <select
          name="embedMode"
          id="embedMode"
          className={styles.embedMode}
          value={embedMode}
          onChange={(e) => {
            setEmbedMode(JSON.parse(e.target.value));
            localStorage.setItem("GulFlixStreamEmbedMode", e.target.value);
          }}
        >
          <option value="true">Embed Mode</option>
          <option value="false">NON Embed Mode (AD-free)</option>
        </select>
      </div>

      <div className={`${styles.loader} skeleton`}>Loading</div>

      {embedMode === false && nonEmbedURL !== "" && (
        <Player
          option={{ url: nonEmbedURL }}
          format={nonEmbedFormat}
          captions={nonEmbedCaptions}
          className={styles.videoPlayer}
        />
      )}

      {/* ✅ ACTIVE IFRAME OPTIONS */}

      {source === "EMB" && id && embedMode === true ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_EMB}/embed/${type}/${id}`
              : `${STREAM_URL_EMB}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "VID" && id && embedMode === true ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_VID}/embed/${type}/${id}`
              : `${STREAM_URL_AGG}/embed/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "ANY" && id && embedMode === true ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_ANY}/embed/movie/${id}`
              : `${STREAM_URL_ANY}/embed/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "AGG" && id && embedMode === true ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_AGG}/embed/${type}/?id=${id}`
              : `${STREAM_URL_VID}/embed/${type}/?id=${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}
      {source === "NEXT" && id && embedMode === true ? (
        <iframe
          src={
            type === "movie"
              ? `${STREAM_URL_NEXT}/${type}/${id}`
              : `${STREAM_URL_NEXT}/${type}/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}
      {/* ❌ COMMENTED IFRAME BLOCKS (kept in code, but disabled) */}

      {/*source === "PRO" && id && embedMode === true ? (
        <iframe src={`${STREAM_URL_PRO}/embed/${type}/${id}`} className={styles.iframe}></iframe>
      ) : null}

      ... etc (other commented blocks)

      */}
    </div>
  );
};

export default Watch;
