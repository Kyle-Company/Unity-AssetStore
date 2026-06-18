using UnityEditor;
using UnityEngine;

namespace RainbowBolt.SciFiUI.Editor
{
    /// <summary>
    /// Auto-configures every pack PNG as a crisp UI sprite on import — sprite type,
    /// pixels-per-unit, clamp/no-mipmaps, and the exact 9-slice border from
    /// sprite_meta.json. This is why you never have to hand-slice a single sprite.
    /// </summary>
    public class SpriteImportSettings : AssetPostprocessor
    {
        void OnPreprocessTexture()
        {
            if (!assetPath.EndsWith(".png")) return;
            if (!PackMeta.TryGetEntry(assetPath, out var e, out _)) return;

            var ti = (TextureImporter)assetImporter;
            ti.textureType = TextureImporterType.Sprite;
            ti.spriteImportMode = SpriteImportMode.Single;
            ti.spritePixelsPerUnit = e.pixelsPerUnit > 0 ? e.pixelsPerUnit : 100;
            ti.mipmapEnabled = false;
            ti.filterMode = FilterMode.Bilinear;
            ti.wrapMode = TextureWrapMode.Clamp;
            ti.alphaIsTransparency = true;
            ti.sRGBTexture = true;
            ti.textureCompression = TextureImporterCompression.Uncompressed; // crisp edges for UI

            var s = new TextureImporterSettings();
            ti.ReadTextureSettings(s);
            s.spriteMeshType = SpriteMeshType.FullRect; // required for correct 9-slicing
            s.spriteAlignment = (int)SpriteAlignment.Center;
            if (e.border != null && e.border.Length == 4)
                s.spriteBorder = new Vector4(e.border[0], e.border[1], e.border[2], e.border[3]);
            ti.SetTextureSettings(s);
        }
    }
}
