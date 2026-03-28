import { Router, type IRouter } from "express";
import axios from "axios";

const router: IRouter = Router();

const BASE_URL = "https://www.sankavollerei.com/anime";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json",
  Referer: "https://www.sankavollerei.com/",
  Origin: "https://www.sankavollerei.com",
};

async function sankaGet(path: string, params?: Record<string, string | number>) {
  const url = `${BASE_URL}${path}`;
  const res = await axios.get(url, {
    headers: HEADERS,
    params,
    timeout: 15000,
  });
  return res.data;
}

router.get("/anime/ongoing", async (req, res) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const data = await sankaGet("/ongoing-anime", { page });
    const animeList = data?.data?.animeList ?? [];
    res.json({
      animeList,
      hasNextPage: animeList.length >= 10,
      currentPage: page,
    });
  } catch (e: any) {
    req.log.error({ err: e }, "ongoing error");
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/detail", async (req, res) => {
  try {
    const animeId = req.query.animeId as string;
    if (!animeId) {
      res.status(400).json({ error: "animeId is required" });
      return;
    }
    const data = await sankaGet(`/anime/${animeId}`);
    const d = data?.data ?? {};
    res.json({
      title: d.title ?? "",
      poster: d.poster ?? "",
      japanese: d.japanese ?? null,
      score: d.score ?? null,
      type: d.type ?? null,
      status: d.status ?? null,
      episodes: d.episodes ?? null,
      duration: d.duration ?? null,
      aired: d.aired ?? null,
      studios: d.studios ?? null,
      synopsis: d.synopsis?.paragraphs?.join(" ") ?? null,
      genreList: d.genreList ?? [],
      episodeList: d.episodeList ?? [],
      batch: d.batch ?? null,
    });
  } catch (e: any) {
    req.log.error({ err: e }, "detail error");
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/episode", async (req, res) => {
  try {
    const episodeId = req.query.episodeId as string;
    if (!episodeId) {
      res.status(400).json({ error: "episodeId is required" });
      return;
    }
    const data = await sankaGet(`/episode/${episodeId}`);
    const d = data?.data ?? {};
    const sources = (d.streamingLink ?? []).map((s: any) => ({
      server: s.server ?? s.provider ?? "Unknown",
      url: s.url ?? s.link ?? s.iframe ?? "",
      quality: s.quality ?? null,
      isExternal: false,
      type: s.url?.includes("iframe") || s.iframe ? "iframe" : "direct",
    }));
    const downloadLinks = (d.downloadLink ?? []).flatMap((group: any) => {
      const quality = group.quality ?? "";
      return (group.links ?? []).map((l: any) => ({
        server: l.server ?? l.name ?? "Download",
        url: l.link ?? l.url ?? "",
        quality,
      }));
    });
    res.json({
      title: d.title ?? episodeId,
      episode: d.eps ? `Episode ${d.eps}` : episodeId,
      sources,
      downloadLinks,
    });
  } catch (e: any) {
    req.log.error({ err: e }, "episode error");
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/search", async (req, res) => {
  try {
    const q = req.query.q as string;
    const page = req.query.page ? Number(req.query.page) : 1;
    if (!q) {
      res.status(400).json({ error: "q is required" });
      return;
    }
    const data = await sankaGet("/search", { q, page });
    const animeList = data?.data?.animeList ?? [];
    res.json({
      animeList,
      hasNextPage: animeList.length >= 10,
      currentPage: page,
    });
  } catch (e: any) {
    req.log.error({ err: e }, "search error");
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/genres", async (req, res) => {
  try {
    const data = await sankaGet("/genre");
    const genreList = data?.data?.genreList ?? [];
    res.json({ genreList });
  } catch (e: any) {
    req.log.error({ err: e }, "genres error");
    res.status(500).json({ error: e.message });
  }
});

router.get("/anime/genre", async (req, res) => {
  try {
    const genreId = req.query.genreId as string;
    const page = req.query.page ? Number(req.query.page) : 1;
    if (!genreId) {
      res.status(400).json({ error: "genreId is required" });
      return;
    }
    const data = await sankaGet(`/genre/${genreId}`, { page });
    const animeList = data?.data?.animeList ?? [];
    res.json({
      animeList,
      hasNextPage: animeList.length >= 10,
      currentPage: page,
    });
  } catch (e: any) {
    req.log.error({ err: e }, "genre error");
    res.status(500).json({ error: e.message });
  }
});

export default router;
