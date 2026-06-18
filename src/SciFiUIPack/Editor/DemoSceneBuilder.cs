using TMPro;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace RainbowBolt.SciFiUI.Editor
{
    /// <summary>
    /// Programmatically builds the demo scene (Canvas, EventSystem, themed panel,
    /// button, animated bar, controls and icons). Generated rather than shipped as a
    /// .unity file so it always references the buyer's freshly-imported sprite GUIDs.
    /// </summary>
    public static class DemoSceneBuilder
    {
        public static string Build(string root, UIThemeSO theme, Material mat)
        {
            if (theme == null) theme = ScriptableObject.CreateInstance<UIThemeSO>();

            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);

            // --- Canvas -------------------------------------------------------
            var canvasGO = new GameObject("SciFi UI Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            canvasGO.GetComponent<Canvas>().renderMode = RenderMode.ScreenSpaceOverlay;
            var scaler = canvasGO.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1920, 1080);
            scaler.matchWidthOrHeight = 0.5f;
            var applier = canvasGO.AddComponent<ThemeApplier>();
            applier.theme = theme;
            var canvasRT = (RectTransform)canvasGO.transform;

            if (Object.FindFirstObjectByType<EventSystem>() == null)
                new GameObject("EventSystem", typeof(EventSystem), typeof(StandaloneInputModule));

            // --- Background (drives the animated scanline material) -----------
            var bg = NewImage(canvasRT, "Background", null, new Color32(8, 20, 26, 255));
            Stretch(bg.rectTransform);
            bg.raycastTarget = false;
            if (mat != null) bg.material = mat;

            var topLine = NewImage(canvasRT, "TopLine", null, theme.accent);
            topLine.raycastTarget = false;
            topLine.rectTransform.anchorMin = new Vector2(0, 1);
            topLine.rectTransform.anchorMax = new Vector2(1, 1);
            topLine.rectTransform.pivot = new Vector2(0.5f, 1f);
            topLine.rectTransform.sizeDelta = new Vector2(0, 4);
            topLine.rectTransform.anchoredPosition = new Vector2(0, -2);

            // --- Title --------------------------------------------------------
            var title = NewText(canvasRT, "Title", "SCI-FI UI PACK", 64, theme.textPrimary);
            Anchor(title.rectTransform, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -96), new Vector2(1000, 80));
            var sub = NewText(canvasRT, "Subtitle", "RAINBOW BOLT STUDIO", 22, theme.textMuted);
            sub.characterSpacing = 8;
            Anchor(sub.rectTransform, new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0, -148), new Vector2(1000, 40));

            // --- Panel --------------------------------------------------------
            var panel = NewImage(canvasRT, "Panel", Load(root, "Sprites/Panels/panel.png"), Color.white);
            Anchor(panel.rectTransform, new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0, -30), new Vector2(760, 470));
            panel.gameObject.AddComponent<CanvasGroup>();
            panel.gameObject.AddComponent<HoloPanel>().openOnEnable = true;
            var panelRT = panel.rectTransform;

            var panelTitle = NewText(panelRT, "PanelTitle", "SYSTEM PANEL", 30, theme.cyan, TextAlignmentOptions.Left);
            Anchor(panelTitle.rectTransform, new Vector2(0, 1f), new Vector2(0, 1f), new Vector2(44, -36), new Vector2(420, 40));

            // Button with sprite-swap across all four states
            var btnImg = NewImage(panelRT, "PlayButton", Load(root, "Sprites/Buttons/button_normal.png"), Color.white);
            Anchor(btnImg.rectTransform, new Vector2(0, 1f), new Vector2(0, 1f), new Vector2(44, -118), new Vector2(260, 70));
            var btn = btnImg.gameObject.AddComponent<HoloButton>();
            btn.targetGraphic = btnImg;
            btn.transition = Selectable.Transition.SpriteSwap;
            btn.spriteState = new SpriteState
            {
                highlightedSprite = Load(root, "Sprites/Buttons/button_hover.png"),
                pressedSprite = Load(root, "Sprites/Buttons/button_pressed.png"),
                selectedSprite = Load(root, "Sprites/Buttons/button_hover.png"),
                disabledSprite = Load(root, "Sprites/Buttons/button_disabled.png"),
            };
            var btnLabel = NewText(btnImg.rectTransform, "Label", "PLAY", 26, theme.textPrimary);
            Stretch(btnLabel.rectTransform);

            // Animated health bar
            var barLabel = NewText(panelRT, "HealthLabel", "HEALTH", 18, theme.textMuted, TextAlignmentOptions.Left);
            Anchor(barLabel.rectTransform, new Vector2(0, 1f), new Vector2(0, 1f), new Vector2(44, -208), new Vector2(220, 24));
            var barBg = NewImage(panelRT, "HealthBar", Load(root, "Sprites/Bars/bar_bg.png"), Color.white);
            Anchor(barBg.rectTransform, new Vector2(0, 1f), new Vector2(0, 1f), new Vector2(44, -234), new Vector2(340, 28));
            var barFill = NewImage(barBg.rectTransform, "Fill", Load(root, "Sprites/Bars/bar_fill.png"), theme.accent);
            Stretch(barFill.rectTransform, 3, 3, 3, 3);
            barFill.type = Image.Type.Filled;
            barFill.fillMethod = Image.FillMethod.Horizontal;
            var bar = barBg.gameObject.AddComponent<AnimatedBar>();
            bar.fill = barFill;
            bar.BuildDefaultGradient();
            bar.useGradient = true;
            bar.SetValue(0.72f, true);

            // Controls (top-right of panel)
            var toggle = NewImage(panelRT, "Toggle", Load(root, "Sprites/Inputs/toggle_track.png"), Color.white);
            Anchor(toggle.rectTransform, new Vector2(1, 1f), new Vector2(1, 1f), new Vector2(-44, -120), new Vector2(64, 28));
            var knob = NewImage(toggle.rectTransform, "Knob", Load(root, "Sprites/Inputs/toggle_knob.png"), theme.accent);
            knob.type = Image.Type.Simple;
            Anchor(knob.rectTransform, new Vector2(1, 0.5f), new Vector2(1, 0.5f), new Vector2(-4, 0), new Vector2(20, 20));

            var checkbox = NewImage(panelRT, "Checkbox", Load(root, "Sprites/Inputs/checkbox_on.png"), Color.white);
            checkbox.type = Image.Type.Simple;
            Anchor(checkbox.rectTransform, new Vector2(1, 1f), new Vector2(1, 1f), new Vector2(-58, -168), new Vector2(40, 40));

            // Icon strip (bottom of panel)
            string[] icons = { "heart", "shield", "bolt", "star", "settings", "map" };
            for (int i = 0; i < icons.Length; i++)
            {
                var ic = NewImage(panelRT, "Icon_" + icons[i], Load(root, "Icons/" + icons[i] + ".png"), theme.cyan);
                ic.type = Image.Type.Simple;
                Anchor(ic.rectTransform, new Vector2(0, 0f), new Vector2(0, 0f), new Vector2(44 + i * 64, 40), new Vector2(48, 48));
            }

            // --- save ---------------------------------------------------------
            PackBuilder.EnsureFolder(root + "/Demo");
            string scenePath = root + "/Demo/SciFiUIDemo.unity";
            applier.Apply();
            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene, scenePath);
            return scenePath;
        }

        // ---- tiny UGUI helpers ----------------------------------------------
        static RectTransform NewRect(Transform parent, string name)
        {
            var go = new GameObject(name, typeof(RectTransform));
            go.transform.SetParent(parent, false);
            return (RectTransform)go.transform;
        }

        static Image NewImage(Transform parent, string name, Sprite sprite, Color color)
        {
            var rt = NewRect(parent, name);
            var img = rt.gameObject.AddComponent<Image>();
            img.sprite = sprite;
            img.color = color;
            if (sprite != null) img.type = Image.Type.Sliced;
            return img;
        }

        static TextMeshProUGUI NewText(Transform parent, string name, string text, float size, Color color,
            TextAlignmentOptions align = TextAlignmentOptions.Center)
        {
            var rt = NewRect(parent, name);
            var t = rt.gameObject.AddComponent<TextMeshProUGUI>();
            t.text = text;
            t.fontSize = size;
            t.color = color;
            t.alignment = align;
            t.raycastTarget = false;
            return t;
        }

        static void Stretch(RectTransform rt, float l = 0, float b = 0, float r = 0, float t = 0)
        {
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = new Vector2(l, b);
            rt.offsetMax = new Vector2(-r, -t);
        }

        static void Anchor(RectTransform rt, Vector2 anchor, Vector2 pivot, Vector2 pos, Vector2 size)
        {
            rt.anchorMin = rt.anchorMax = anchor;
            rt.pivot = pivot;
            rt.sizeDelta = size;
            rt.anchoredPosition = pos;
        }

        static Sprite Load(string root, string rel) => AssetDatabase.LoadAssetAtPath<Sprite>(root + "/" + rel);
    }
}
