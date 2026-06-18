using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;

namespace RainbowBolt.SciFiUI.Editor
{
    /// <summary>
    /// Shared helpers for locating the pack and reading sprite_meta.json (the
    /// 9-slice border manifest emitted by the asset generator). Used by the
    /// auto-importer, the one-click builder, and the validator.
    /// </summary>
    public static class PackMeta
    {
        public const string PackFolderName = "SciFiUIPack";
        public const string MetaFileName = "sprite_meta.json";

        [Serializable]
        public class Entry
        {
            public string path;        // package-relative, e.g. "Sprites/Buttons/button_normal.png"
            public int[] border;       // [left, bottom, right, top] in texture pixels
            public int pixelsPerUnit;
            public bool ninePatch;
        }

        [Serializable]
        public class MetaFile { public Entry[] entries; }

        // cache keyed by project-relative meta path
        static readonly Dictionary<string, (DateTime stamp, Dictionary<string, Entry> map)> _cache = new();

        /// <summary>
        /// Given a texture's assetPath, resolve its pack-relative entry from the
        /// sibling sprite_meta.json. Reads from disk (import-safe) and caches by file timestamp.
        /// </summary>
        public static bool TryGetEntry(string assetPath, out Entry entry, out string rootProj)
        {
            entry = null; rootProj = null;
            string marker = "/" + PackFolderName + "/";
            int idx = assetPath.IndexOf(marker, StringComparison.Ordinal);
            if (idx < 0) return false;

            rootProj = assetPath.Substring(0, idx + marker.Length - 1);   // ".../SciFiUIPack"
            string rel = assetPath.Substring(idx + marker.Length);        // "Sprites/.../x.png"
            string metaProj = rootProj + "/" + MetaFileName;

            var map = LoadMap(metaProj);
            if (map == null) return false;
            return map.TryGetValue(rel, out entry);
        }

        /// <summary>Load (and cache) the entry map for a given project-relative meta path.</summary>
        public static Dictionary<string, Entry> LoadMap(string metaProjPath)
        {
            string full;
            try { full = Path.GetFullPath(metaProjPath); }
            catch { return null; }
            if (!File.Exists(full)) return null;

            DateTime stamp = File.GetLastWriteTimeUtc(full);
            if (_cache.TryGetValue(metaProjPath, out var cached) && cached.stamp == stamp)
                return cached.map;

            var map = new Dictionary<string, Entry>();
            try
            {
                var meta = JsonUtility.FromJson<MetaFile>(File.ReadAllText(full));
                if (meta?.entries != null)
                    foreach (var e in meta.entries)
                        if (!string.IsNullOrEmpty(e.path)) map[e.path] = e;
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Sci-Fi UI] Failed to parse {metaProjPath}: {ex.Message}");
                return null;
            }

            _cache[metaProjPath] = (stamp, map);
            return map;
        }

        /// <summary>Find the pack root folder ("Assets/.../SciFiUIPack") via the meta asset. Null if absent.</summary>
        public static string FindRoot()
        {
            foreach (var guid in AssetDatabase.FindAssets(MetaFileName.Replace(".json", "")))
            {
                string p = AssetDatabase.GUIDToAssetPath(guid);
                if (p.EndsWith("/" + PackFolderName + "/" + MetaFileName, StringComparison.Ordinal))
                    return p.Substring(0, p.Length - ("/" + MetaFileName).Length);
            }
            return null;
        }
    }
}
