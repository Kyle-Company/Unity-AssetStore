using UnityEngine;
using TMPro;

namespace RainbowBolt.SciFiUI
{
    /// <summary>
    /// Central palette + typography for the Sci-Fi UI Pack. Drop one in your project
    /// (Create ▸ Rainbow Bolt ▸ Sci-Fi UI Theme), tweak the colors, and a
    /// <see cref="ThemeApplier"/> will push them onto every themed component and
    /// TextMeshPro label under it — so you can recolor the whole UI in one place.
    /// </summary>
    [CreateAssetMenu(fileName = "SciFiTheme", menuName = "Rainbow Bolt/Sci-Fi UI Theme", order = 0)]
    public class UIThemeSO : ScriptableObject
    {
        [Header("Palette")]
        public Color primary     = new Color32(15, 46, 52, 255);    // #0F2E34 panel/base
        public Color accent      = new Color32(63, 217, 138, 255);  // #3FD98A green
        public Color accentAlt   = new Color32(52, 183, 255, 255);  // #34B7FF blue
        public Color cyan        = new Color32(127, 227, 255, 255); // #7FE3FF highlight
        public Color textPrimary = new Color32(230, 252, 255, 255); // #E6FCFF
        public Color textMuted   = new Color32(94, 154, 160, 255);  // #5E9AA0

        [Header("Semantic")]
        public Color success = new Color32(63, 217, 138, 255);  // #3FD98A
        public Color warning = new Color32(255, 210, 61, 255);  // #FFD23D
        public Color danger  = new Color32(255, 90, 95, 255);   // #FF5A5F

        [Header("Typography")]
        public TMP_FontAsset font;

        [Header("Shader Effects (defaults for SciFiUI material)")]
        [Range(0f, 1f)] public float scanlineStrength = 0.10f;
        [Range(0f, 4f)] public float glowStrength = 1.2f;
        [Range(0f, 1f)] public float flicker = 0.0f;
    }
}
