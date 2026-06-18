using UnityEngine;
using UnityEngine.UI;

namespace RainbowBolt.SciFiUI
{
    /// <summary>
    /// A health / energy / progress bar that smoothly animates toward its target
    /// value and (optionally) recolors along a gradient as it fills. Drive it from
    /// gameplay with <see cref="SetValue"/>. The <c>fill</c> Image is set to
    /// Filled ▸ Horizontal automatically.
    /// </summary>
    [ExecuteAlways]
    [AddComponentMenu("Rainbow Bolt/Animated Bar")]
    public class AnimatedBar : MonoBehaviour, IThemed
    {
        [Tooltip("The Image whose fillAmount represents the value (uses the bar_fill sprite).")]
        public Image fill;

        [Range(0f, 1f)] public float value = 1f;
        [Tooltip("Higher = snappier. Time is unscaled, so it animates even while paused.")]
        public float speed = 8f;

        [Header("Color")]
        public bool useGradient = true;
        public Gradient gradient = new Gradient();
        public Color flatColor = new Color32(63, 217, 138, 255);

        float _display;

        void Reset()
        {
            BuildDefaultGradient();
            ConfigureFill();
        }

        void OnValidate()
        {
            value = Mathf.Clamp01(value);
            ConfigureFill();
            if (!Application.isPlaying)
            {
                _display = value;
                Render();
            }
        }

        void OnEnable()
        {
            _display = value;
            Render();
        }

        void Update()
        {
            if (!Application.isPlaying) return;
            if (!Mathf.Approximately(_display, value))
            {
                _display = Mathf.Lerp(_display, value, Time.unscaledDeltaTime * speed);
                if (Mathf.Abs(_display - value) < 0.001f) _display = value;
                Render();
            }
        }

        /// <summary>Set the bar value (0..1). Pass instant=true to skip the animation.</summary>
        public void SetValue(float v, bool instant = false)
        {
            value = Mathf.Clamp01(v);
            if (instant) { _display = value; Render(); }
        }

        void Render()
        {
            if (fill == null) return;
            fill.fillAmount = _display;
            fill.color = useGradient ? gradient.Evaluate(_display) : flatColor;
        }

        void ConfigureFill()
        {
            if (fill == null) return;
            fill.type = Image.Type.Filled;
            fill.fillMethod = Image.FillMethod.Horizontal;
            fill.fillOrigin = (int)Image.OriginHorizontal.Left;
        }

        public void BuildDefaultGradient()
        {
            gradient = new Gradient();
            gradient.SetKeys(
                new[]
                {
                    new GradientColorKey(new Color32(255, 90, 95, 255), 0.0f),   // danger when low
                    new GradientColorKey(new Color32(255, 210, 61, 255), 0.4f),  // warning
                    new GradientColorKey(new Color32(63, 217, 138, 255), 0.7f),  // healthy
                    new GradientColorKey(new Color32(127, 227, 255, 255), 1.0f), // full
                },
                new[] { new GradientAlphaKey(1f, 0f), new GradientAlphaKey(1f, 1f) });
        }

        public void ApplyTheme(UIThemeSO theme)
        {
            flatColor = theme.accent;
        }
    }
}
