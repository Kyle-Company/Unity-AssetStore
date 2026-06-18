using System;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;

namespace RainbowBolt.SciFiUI.Editor
{
    /// <summary>
    /// One-click setup. Reimports the sprites (applying 9-slice borders), creates a
    /// default theme + shared material, and builds a demo scene — so a buyer can go
    /// from "just imported" to "running showcase" with a single menu click.
    /// </summary>
    public static class PackBuilder
    {
        [MenuItem("Rainbow Bolt/Build Sci-Fi UI Pack", false, 0)]
        public static void Build()
        {
            string root = PackMeta.FindRoot();
            if (root == null)
            {
                EditorUtility.DisplayDialog("Sci-Fi UI Pack",
                    "Could not find the pack. Make sure the SciFiUIPack folder (with sprite_meta.json) is somewhere under Assets/.", "OK");
                return;
            }

            try
            {
                EditorUtility.DisplayProgressBar("Sci-Fi UI Pack", "Importing sprites…", 0.2f);
                ReimportTextures(root);

                EditorUtility.DisplayProgressBar("Sci-Fi UI Pack", "Creating theme & material…", 0.5f);
                var theme = EnsureTheme(root);
                var mat = EnsureMaterial(root, theme);
                AssetDatabase.SaveAssets();

                EditorUtility.DisplayProgressBar("Sci-Fi UI Pack", "Building demo scene…", 0.8f);
                string scenePath = DemoSceneBuilder.Build(root, theme, mat);

                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh();
                EditorUtility.ClearProgressBar();

                Debug.Log($"[Sci-Fi UI] Build complete → theme, material and demo scene ready under {root}.");
                EditorUtility.DisplayDialog("Sci-Fi UI Pack",
                    "Build complete!\n\n• Theme  → Theme/SciFiTheme.asset\n• Material → Materials/SciFiUI.mat\n• Demo → Demo/SciFiUIDemo.unity\n\nOpen the demo scene and press Play.\n\n(If text is missing, run Window ▸ TextMeshPro ▸ Import TMP Essential Resources.)",
                    "Open demo");
                var demo = AssetDatabase.LoadAssetAtPath<UnityEngine.Object>(scenePath);
                if (demo != null) AssetDatabase.OpenAsset(demo);
            }
            catch (Exception ex)
            {
                EditorUtility.ClearProgressBar();
                Debug.LogError($"[Sci-Fi UI] Build failed: {ex}");
            }
        }

        [MenuItem("Rainbow Bolt/Generate TMP Font (Orbitron)", false, 20)]
        public static void GenerateFont()
        {
            string root = PackMeta.FindRoot();
            if (root == null) return;

            string ttf = root + "/Fonts/Orbitron.ttf";
            var src = AssetDatabase.LoadAssetAtPath<Font>(ttf);
            if (src == null)
            {
                EditorUtility.DisplayDialog("Sci-Fi UI Pack",
                    "Orbitron.ttf not found under Fonts/. Make sure it imported, then try again.", "OK");
                return;
            }

            try
            {
                var fontAsset = TMP_FontAsset.CreateFontAsset(src);
                if (fontAsset == null) throw new Exception("CreateFontAsset returned null.");
                fontAsset.name = "Orbitron SDF";
                string outPath = root + "/Fonts/Orbitron SDF.asset";
                AssetDatabase.CreateAsset(fontAsset, outPath);

                var theme = EnsureTheme(root);
                theme.font = fontAsset;
                EditorUtility.SetDirty(theme);
                AssetDatabase.SaveAssets();
                Debug.Log($"[Sci-Fi UI] Generated TMP font → {outPath} and assigned it to the theme.");
            }
            catch (Exception ex)
            {
                Debug.LogError($"[Sci-Fi UI] TMP font generation failed (you can still assign any TMP font in the theme): {ex.Message}");
            }
        }

        // ---- steps -----------------------------------------------------------
        static void ReimportTextures(string root)
        {
            foreach (var sub in new[] { "/Sprites", "/Icons" })
                if (AssetDatabase.IsValidFolder(root + sub))
                    AssetDatabase.ImportAsset(root + sub, ImportAssetOptions.ImportRecursive | ImportAssetOptions.ForceUpdate);
        }

        static UIThemeSO EnsureTheme(string root)
        {
            EnsureFolder(root + "/Theme");
            string path = root + "/Theme/SciFiTheme.asset";
            var theme = AssetDatabase.LoadAssetAtPath<UIThemeSO>(path);
            if (theme == null)
            {
                theme = ScriptableObject.CreateInstance<UIThemeSO>();
                AssetDatabase.CreateAsset(theme, path);
            }
            if (theme.font == null)
            {
                foreach (var guid in AssetDatabase.FindAssets("t:TMP_FontAsset"))
                {
                    string p = AssetDatabase.GUIDToAssetPath(guid);
                    if (p.Contains("Orbitron") || p.Contains(PackMeta.PackFolderName))
                    {
                        var f = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(p);
                        if (f != null) { theme.font = f; break; }
                    }
                }
            }
            EditorUtility.SetDirty(theme);
            return theme;
        }

        static Material EnsureMaterial(string root, UIThemeSO theme)
        {
            var sh = Shader.Find("RainbowBolt/SciFiUI");
            if (sh == null)
            {
                Debug.LogWarning("[Sci-Fi UI] Shader 'RainbowBolt/SciFiUI' not found — skipping material. (Effects are optional.)");
                return null;
            }
            EnsureFolder(root + "/Materials");
            string matPath = root + "/Materials/SciFiUI.mat";
            var mat = AssetDatabase.LoadAssetAtPath<Material>(matPath);
            if (mat == null)
            {
                mat = new Material(sh) { name = "SciFiUI" };
                AssetDatabase.CreateAsset(mat, matPath);
            }
            else if (mat.shader != sh) mat.shader = sh;

            mat.SetFloat("_ScanlineStrength", theme != null ? theme.scanlineStrength : 0.1f);
            mat.SetFloat("_GlowStrength", theme != null ? theme.glowStrength : 1.2f);
            mat.SetFloat("_Flicker", theme != null ? theme.flicker : 0f);
            EditorUtility.SetDirty(mat);
            return mat;
        }

        /// <summary>Create a project folder (and any missing parents).</summary>
        public static void EnsureFolder(string projFolder)
        {
            projFolder = projFolder.Replace('\\', '/').TrimEnd('/');
            if (AssetDatabase.IsValidFolder(projFolder)) return;
            string parent = Path.GetDirectoryName(projFolder).Replace('\\', '/');
            string name = Path.GetFileName(projFolder);
            if (!AssetDatabase.IsValidFolder(parent)) EnsureFolder(parent);
            AssetDatabase.CreateFolder(parent, name);
        }
    }
}
