// Sci-Fi UI Pack — Rainbow Bolt Studio
// UGUI / Canvas-compatible unlit transparent shader. Built on Unity's UI-Default
// template (full stencil + 2D clip-rect support) so it behaves correctly inside
// masks and scroll views, in both URP and Built-in. All effects default to 0,
// so out of the box it renders identically to UI/Default — dial them in per material.
Shader "RainbowBolt/SciFiUI"
{
    Properties
    {
        [PerRendererData] _MainTex ("Sprite Texture", 2D) = "white" {}
        _Color ("Tint", Color) = (1,1,1,1)

        _StencilComp ("Stencil Comparison", Float) = 8
        _Stencil ("Stencil ID", Float) = 0
        _StencilOp ("Stencil Operation", Float) = 0
        _StencilWriteMask ("Stencil Write Mask", Float) = 255
        _StencilReadMask ("Stencil Read Mask", Float) = 255
        _ColorMask ("Color Mask", Float) = 15
        [Toggle(UNITY_UI_ALPHACLIP)] _UseUIAlphaClip ("Use Alpha Clip", Float) = 0

        [Header(Sci Fi Effects)]
        _ScanlineColor ("Scanline Color", Color) = (0.5,0.9,1,0.6)
        _ScanlineCount ("Scanline Count", Float) = 80
        _ScanlineSpeed ("Scanline Speed", Float) = -1.5
        _ScanlineStrength ("Scanline Strength", Range(0,1)) = 0
        _GlowColor ("Edge Glow Color", Color) = (0.25,0.85,1,1)
        _GlowStrength ("Edge Glow Strength", Range(0,4)) = 0
        _Flicker ("Holo Flicker", Range(0,1)) = 0
    }

    SubShader
    {
        Tags
        {
            "Queue"="Transparent"
            "IgnoreProjector"="True"
            "RenderType"="Transparent"
            "PreviewType"="Plane"
            "CanUseSpriteAtlas"="True"
        }

        Stencil
        {
            Ref [_Stencil]
            Comp [_StencilComp]
            Pass [_StencilOp]
            ReadMask [_StencilReadMask]
            WriteMask [_StencilWriteMask]
        }

        Cull Off
        Lighting Off
        ZWrite Off
        ZTest [unity_GUIZTestMode]
        Blend SrcAlpha OneMinusSrcAlpha
        ColorMask [_ColorMask]

        Pass
        {
            Name "Default"
        CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma target 2.0

            #include "UnityCG.cginc"
            #include "UnityUI.cginc"

            #pragma multi_compile_local _ UNITY_UI_CLIP_RECT
            #pragma multi_compile_local _ UNITY_UI_ALPHACLIP

            struct appdata_t
            {
                float4 vertex   : POSITION;
                float4 color    : COLOR;
                float2 texcoord : TEXCOORD0;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float4 vertex        : SV_POSITION;
                fixed4 color         : COLOR;
                float2 texcoord      : TEXCOORD0;
                float4 worldPosition : TEXCOORD1;
                UNITY_VERTEX_OUTPUT_STEREO
            };

            fixed4 _Color;
            fixed4 _TextureSampleAdd;
            float4 _ClipRect;
            sampler2D _MainTex;
            float4 _MainTex_ST;

            fixed4 _ScanlineColor;
            float _ScanlineCount;
            float _ScanlineSpeed;
            float _ScanlineStrength;
            fixed4 _GlowColor;
            float _GlowStrength;
            float _Flicker;

            v2f vert(appdata_t v)
            {
                v2f OUT;
                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(OUT);
                OUT.worldPosition = v.vertex;
                OUT.vertex = UnityObjectToClipPos(OUT.worldPosition);
                OUT.texcoord = TRANSFORM_TEX(v.texcoord, _MainTex);
                OUT.color = v.color * _Color;
                return OUT;
            }

            fixed4 frag(v2f IN) : SV_Target
            {
                half4 color = (tex2D(_MainTex, IN.texcoord) + _TextureSampleAdd) * IN.color;
                half a = color.a;

                // animated scanlines
                float scan = saturate(sin(IN.texcoord.y * _ScanlineCount + _Time.y * _ScanlineSpeed));
                color.rgb = lerp(color.rgb, color.rgb + _ScanlineColor.rgb, scan * _ScanlineStrength * _ScanlineColor.a);

                // holographic flicker
                float fl = 1.0 - _Flicker * (0.5 + 0.5 * sin(_Time.y * 40.0)) * 0.15;
                color.rgb *= fl;

                // emissive rim on anti-aliased alpha edges
                color.rgb += _GlowColor.rgb * (_GlowStrength * a * (1.0 - a) * 4.0);

                #ifdef UNITY_UI_CLIP_RECT
                color.a *= UnityGet2DClipping(IN.worldPosition.xy, _ClipRect);
                #endif

                #ifdef UNITY_UI_ALPHACLIP
                clip (color.a - 0.001);
                #endif

                return color;
            }
        ENDCG
        }
    }
}
