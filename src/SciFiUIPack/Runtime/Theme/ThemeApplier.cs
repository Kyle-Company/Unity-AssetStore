using UnityEngine;
using TMPro;

namespace RainbowBolt.SciFiUI
{
    /// <summary>
    /// Put this on a root UI object (e.g. your Canvas). On enable — or via the
    /// context-menu / <see cref="Apply"/> — it pushes the assigned <see cref="UIThemeSO"/>
    /// onto every <see cref="IThemed"/> component and TextMeshPro label beneath it.
    /// </summary>
    [ExecuteAlways]
    [AddComponentMenu("Rainbow Bolt/Theme Applier")]
    [DisallowMultipleComponent]
    public class ThemeApplier : MonoBehaviour
    {
        public UIThemeSO theme;
        [Tooltip("Re-apply automatically whenever this object is enabled.")]
        public bool applyOnEnable = true;
        [Tooltip("Also set the theme font on every TextMeshPro label below.")]
        public bool applyFont = true;

        void OnEnable()
        {
            if (applyOnEnable) Apply();
        }

        [ContextMenu("Apply Theme")]
        public void Apply()
        {
            if (theme == null) return;

            if (applyFont && theme.font != null)
            {
                var texts = GetComponentsInChildren<TMP_Text>(true);
                for (int i = 0; i < texts.Length; i++)
                    texts[i].font = theme.font;
            }

            var behaviours = GetComponentsInChildren<MonoBehaviour>(true);
            for (int i = 0; i < behaviours.Length; i++)
                if (behaviours[i] is IThemed themed)
                    themed.ApplyTheme(theme);
        }
    }
}
