using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

namespace RainbowBolt.SciFiUI
{
    /// <summary>
    /// A drop-in replacement for UGUI <see cref="Button"/> with sci-fi flavor:
    /// smooth hover/press scale, an accent graphic that recolors on highlight, and
    /// optional hover/click sounds. Works with the pack's button sprites or any others.
    /// </summary>
    [AddComponentMenu("Rainbow Bolt/Holo Button")]
    public class HoloButton : Button, IThemed
    {
        [Header("Motion")]
        [Tooltip("Scale multiplier while hovered.")]
        public float hoverScale = 1.04f;
        [Tooltip("Scale multiplier while held down.")]
        public float pressScale = 0.96f;
        [Tooltip("How quickly the scale eases toward its target.")]
        public float tweenSpeed = 12f;

        [Header("Accent")]
        [Tooltip("Optional graphic (e.g. the left accent bar or an icon) recolored on hover.")]
        public Graphic accentGraphic;
        public Color normalAccent = new Color32(63, 217, 138, 255);   // green
        public Color highlightAccent = new Color32(127, 227, 255, 255); // cyan

        [Header("Audio (optional)")]
        public AudioSource audioSource;
        public AudioClip hoverClip;
        public AudioClip clickClip;

        float _targetScale = 1f;

        protected override void Awake()
        {
            base.Awake();
            SetAccent(normalAccent);
        }

        protected override void DoStateTransition(SelectionState state, bool instant)
        {
            base.DoStateTransition(state, instant);

            switch (state)
            {
                case SelectionState.Highlighted:
                    _targetScale = hoverScale;
                    SetAccent(highlightAccent);
                    Play(hoverClip);
                    break;
                case SelectionState.Pressed:
                    _targetScale = pressScale;
                    SetAccent(highlightAccent);
                    break;
                case SelectionState.Disabled:
                    _targetScale = 1f;
                    SetAccent(normalAccent);
                    break;
                default: // Normal / Selected
                    _targetScale = 1f;
                    SetAccent(normalAccent);
                    break;
            }

            if (instant)
                transform.localScale = new Vector3(_targetScale, _targetScale, 1f);
        }

        void Update()
        {
            float s = transform.localScale.x;
            if (Mathf.Approximately(s, _targetScale)) return;
            float n = Mathf.Lerp(s, _targetScale, Time.unscaledDeltaTime * tweenSpeed);
            transform.localScale = new Vector3(n, n, 1f);
        }

        public override void OnPointerClick(PointerEventData eventData)
        {
            base.OnPointerClick(eventData);
            if (IsInteractable()) Play(clickClip);
        }

        void SetAccent(Color c)
        {
            if (accentGraphic != null) accentGraphic.color = c;
        }

        void Play(AudioClip clip)
        {
            if (audioSource != null && clip != null)
                audioSource.PlayOneShot(clip);
        }

        public void ApplyTheme(UIThemeSO theme)
        {
            normalAccent = theme.accent;
            highlightAccent = theme.cyan;
            if (!Application.isPlaying) SetAccent(normalAccent);
        }
    }
}
