using System.Collections;
using UnityEngine;

namespace RainbowBolt.SciFiUI
{
    /// <summary>
    /// Animated show/hide for a UI panel — scales up from a slightly smaller size
    /// while fading in, and reverses on close. Uses unscaled time so it works in
    /// paused menus. Requires a <see cref="CanvasGroup"/> (added automatically).
    /// </summary>
    [RequireComponent(typeof(CanvasGroup))]
    [AddComponentMenu("Rainbow Bolt/Holo Panel")]
    public class HoloPanel : MonoBehaviour, IThemed
    {
        [Tooltip("Seconds for the open/close transition.")]
        public float duration = 0.22f;
        [Tooltip("Scale the panel grows from when opening (and shrinks to when closing).")]
        public Vector3 fromScale = new Vector3(0.92f, 0.92f, 1f);
        [Tooltip("Play the open animation automatically when enabled.")]
        public bool openOnEnable = false;
        [Tooltip("Deactivate the GameObject once fully closed.")]
        public bool deactivateOnClose = false;

        CanvasGroup _cg;
        Coroutine _routine;

        CanvasGroup Group => _cg != null ? _cg : (_cg = GetComponent<CanvasGroup>());

        void OnEnable()
        {
            if (openOnEnable) Open();
        }

        public bool IsOpen => Group.alpha > 0.5f;

        public void Toggle() { if (IsOpen) Close(); else Open(); }

        public void Open() => Animate(true);

        public void Close() => Animate(false);

        void Animate(bool show)
        {
            if (show && !gameObject.activeSelf) gameObject.SetActive(true);

            if (!isActiveAndEnabled)
            {
                // Not in a state where we can run a coroutine — snap to the end state.
                ApplyState(show ? 1f : 0f, show);
                if (!show && deactivateOnClose) gameObject.SetActive(false);
                return;
            }

            if (_routine != null) StopCoroutine(_routine);
            _routine = StartCoroutine(Run(show));
        }

        IEnumerator Run(bool show)
        {
            var group = Group;
            group.blocksRaycasts = show;
            group.interactable = show;

            float startA = group.alpha;
            float endA = show ? 1f : 0f;
            Vector3 startS = transform.localScale;
            Vector3 endS = show ? Vector3.one : fromScale;
            if (show && startA <= 0.01f) startS = fromScale;

            float t = 0f;
            while (t < duration)
            {
                t += Time.unscaledDeltaTime;
                float k = duration > 0f ? Mathf.SmoothStep(0f, 1f, t / duration) : 1f;
                group.alpha = Mathf.Lerp(startA, endA, k);
                transform.localScale = Vector3.Lerp(startS, endS, k);
                yield return null;
            }

            ApplyState(endA, show);
            if (!show && deactivateOnClose) gameObject.SetActive(false);
            _routine = null;
        }

        void ApplyState(float alpha, bool interactable)
        {
            var group = Group;
            group.alpha = alpha;
            group.blocksRaycasts = interactable;
            group.interactable = interactable;
            transform.localScale = alpha > 0.5f ? Vector3.one : fromScale;
        }

        public void ApplyTheme(UIThemeSO theme) { }
    }
}
