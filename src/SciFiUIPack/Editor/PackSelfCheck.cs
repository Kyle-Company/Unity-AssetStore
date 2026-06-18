using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;

namespace RainbowBolt.SciFiUI.Editor
{
    /// <summary>
    /// Validates the imported pack: every sprite present and typed correctly, 9-slice
    /// borders applied as specified, shader compiled, and (after a build) theme,
    /// material and demo scene in place. Run via Rainbow Bolt ▸ Validate Pack.
    /// </summary>
    public static class PackSelfCheck
    {
        [MenuItem("Rainbow Bolt/Validate Pack", false, 40)]
        public static void Validate()
        {
            string root = PackMeta.FindRoot();
            if (root == null)
            {
                EditorUtility.DisplayDialog("Sci-Fi UI Pack", "Pack not found (no sprite_meta.json under Assets/).", "OK");
                return;
            }

            var map = PackMeta.LoadMap(root + "/" + PackMeta.MetaFileName);
            if (map == null)
            {
                EditorUtility.DisplayDialog("Sci-Fi UI Pack", "Could not read sprite_meta.json.", "OK");
                return;
            }

            int ok = 0, missing = 0, borderBad = 0;
            var problems = new List<string>();

            foreach (var kv in map)
            {
                string assetPath = root + "/" + kv.Key;
                var sprite = AssetDatabase.LoadAssetAtPath<Sprite>(assetPath);
                if (sprite == null)
                {
                    missing++;
                    problems.Add("not imported as Sprite: " + kv.Key);
                    continue;
                }
                ok++;

                var e = kv.Value;
                if (e.ninePatch && e.border != null && e.border.Length == 4)
                {
                    var ti = AssetImporter.GetAtPath(assetPath) as TextureImporter;
                    if (ti != null)
                    {
                        var s = new TextureImporterSettings();
                        ti.ReadTextureSettings(s);
                        var b = s.spriteBorder;
                        if (!Mathf.Approximately(b.x, e.border[0]) || !Mathf.Approximately(b.y, e.border[1]) ||
                            !Mathf.Approximately(b.z, e.border[2]) || !Mathf.Approximately(b.w, e.border[3]))
                        {
                            borderBad++;
                            problems.Add($"border mismatch on {kv.Key}: got ({b.x},{b.y},{b.z},{b.w}) expected ({e.border[0]},{e.border[1]},{e.border[2]},{e.border[3]})");
                        }
                    }
                }
            }

            bool shaderOk = Shader.Find("RainbowBolt/SciFiUI") != null;
            bool themeOk = AssetDatabase.LoadAssetAtPath<UIThemeSO>(root + "/Theme/SciFiTheme.asset") != null;
            bool matOk = AssetDatabase.LoadAssetAtPath<Material>(root + "/Materials/SciFiUI.mat") != null;
            bool demoOk = File.Exists(Path.GetFullPath(root + "/Demo/SciFiUIDemo.unity"));

            var sb = new StringBuilder();
            sb.AppendLine($"Sprites OK: {ok} / {map.Count}");
            if (missing > 0) sb.AppendLine($"Missing/untyped: {missing}");
            if (borderBad > 0) sb.AppendLine($"9-slice border mismatches: {borderBad}");
            sb.AppendLine($"Shader: {(shaderOk ? "OK" : "MISSING")}");
            sb.AppendLine($"Theme asset: {(themeOk ? "OK" : "run Build")}");
            sb.AppendLine($"Material: {(matOk ? "OK" : "run Build")}");
            sb.AppendLine($"Demo scene: {(demoOk ? "OK" : "run Build")}");

            bool pass = missing == 0 && borderBad == 0 && shaderOk;
            string report = sb.ToString();

            if (problems.Count > 0)
                Debug.LogWarning("[Sci-Fi UI] Validation details:\n  " + string.Join("\n  ", problems));
            if (pass) Debug.Log("[Sci-Fi UI] Validation PASSED.\n" + report);
            else Debug.LogError("[Sci-Fi UI] Validation found issues.\n" + report);

            EditorUtility.DisplayDialog(pass ? "Validation passed" : "Validation — issues found", report, "OK");
        }
    }
}
