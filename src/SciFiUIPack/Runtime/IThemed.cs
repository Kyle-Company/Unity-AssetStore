namespace RainbowBolt.SciFiUI
{
    /// <summary>
    /// Implemented by components that can be re-skinned from a <see cref="UIThemeSO"/>.
    /// <see cref="ThemeApplier"/> calls this on every child component when applying a theme.
    /// </summary>
    public interface IThemed
    {
        void ApplyTheme(UIThemeSO theme);
    }
}
