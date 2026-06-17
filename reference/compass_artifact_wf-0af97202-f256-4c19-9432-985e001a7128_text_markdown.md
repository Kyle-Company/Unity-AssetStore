# Unity Asset Store 性价比品类调研报告(2026 年 6 月)

## TL;DR
- **对一个同时具备 3D / 2D / VFX 能力的单人/小团队创作者,2026 年最高性价比的切入点是「风格化 VFX 特效包」(toon/stylized 粒子:弹道、技能、打击、爆炸),其次是「主题化完整 UI 套件」,3D 方向则应聚焦「未被覆盖的细分主题模块化场景/道具套件」;应避开通用贴图/材质、通用低多边形道具和基础图标这类已被红海化且正受 AI 冲击的品类。**
- **Unity Asset Store 采用固定 70/30 分成(创作者拿 70%),最低定价 $4.99,无发布费;但发布需要一个展示相关作品的活跃个人网站,且 2026 年新提交资产须基于 Unity 2022.3+、用 Editor 6.5+ 提交时默认须支持 URP。**
- **现实收入呈长尾分布(Generalist Programmer 2026 指南原话:"Revenue on the Asset Store follows a long-tail distribution. A small percentage of publishers earn the majority of total marketplace revenue"):多数发布者月入仅几十到几百美元,中坚发布者(10+ 资产、细分深耕)可达 $1,000–$5,000/月,头部艺术类发布者(如 NatureManufacture、Staggart、Synty)可达全职乃至团队规模收入;关键不是单个爆款,而是同一风格/主题下成体系的资产库与交叉销售。**

## Key Findings

### 1. 分类体系与规模
Unity Asset Store 当前(2026 年 6 月)顶级大类为:**3D、2D、Add-Ons、Audio、AI、Decentralization、Essentials、Templates、Tools、VFX**(此外有 Industry 行业专区与各类 Sale/Bundle 入口)。AI 是近两年新增的独立大类(含 Generative AI、Behavior AI、Machine Learning 子类及"AI Marketplace / Verified Solutions"专区)。全店资产总量约 10 万+,3D 类约 1.3 万+,2D 类约 1 万+,Tools 类约 1.3 万(店内 facet 实时显示 13,199)。

与创作者三大能力直接相关的子类(当前店内筛选器显示的资产数量,为 2026 年 6 月实时 facet 计数,可能随时变动):

- **3D**:Characters/Humanoids 约 8,005;Creatures 约 4,785(Fantasy 2,720 / Humans 2,456 / Sci-Fi 733 / Robots 789);Environments 2,470(Urban 1,883 / Fantasy 1,580 / Sci-Fi 1,120 / Landscapes 1,028 / Historic 877 / Industrial 782 / Dungeons 450 / Roadways 280);Props 子类中 Weapons 3,583、Furniture 1,859、Interior 1,846、Exterior 1,596、Guns 1,253、Industrial 956、Electronics 911、Food 764、Tools 757、Accessories 327、Armor 162;Vegetation(Trees 711 / Plants 294 / Flowers 234);Vehicles(Land 3,082 / Space 1,173 / Air 743 / Sea 501);Animations 1,805。
- **2D**:Textures & Materials 约 5,480;Icons 3,313;Environments 2,470;Fonts 71;UI/GUI 方面 Tools/GUI 约 1,508。
- **VFX**:Particles 2,318;Shaders 2,306(含 DirectX 11、Fullscreen & Camera Effects、Substances 子类);另有 Tools/Particles & Effects 约 555。VFX 顶层子类为 Environment、Fire & Explosions、Spells。

### 2. 热度与需求
最稳的"刚需"是**所有开发者几乎都要用的通用品类**:UI/图标、特效、角色与环境、动画。Top Paid / Top Sellers 榜单长期由工具类(Odin Inspector、DOTween Pro、Rewired、Amplify Shader Editor)与少数艺术类头部(Synty 低多边形、NatureManufacture 写实自然)占据。

用评分数(review count)和收藏数(favourites)作为销量代理,艺术/VFX 侧的真实热销案例(2026 年 6 月实时抓取):
- **VFX**:Hovl Studio 的 Toon Projectiles 收藏 1,512、Epic Toon VFX 2 评分 (12) 收藏约 1,160($30)、AAA Stylized Projectiles Vol.1 评分 (19)(约 $19);老牌 Archanor VFX 的 Epic Toon FX 评分高达 (232)(约 $40)。
- **VFX 着色器**:Staggart Creations 的 Stylized Water 2 评分 (253)、收藏 2,650+($35),是艺术侧最明确的爆款之一;其 Stylized Grass Shader 收藏 2,843、SC Post Effects Pack 评分 (79)。
- **2D UI**:Michsky 的 Modern UI Pack 评分 (168)、收藏约 1,850($39.99,促销 $19.99);其 Heat – Complete Modern UI 定价 $69.99、Michsky UI Bundle 全集 $149.99。
- **3D**:Synty 的 POLYGON Starter Pack(免费引流)收藏 4,700+;付费 POLYGON 包主要在自有商店 $29.99–$49.99 出售。

新兴/蓝海方向:AI 工具(生成式、行为 AI)、URP/HDRP 兼容资产、Unity 6 兼容资产、移动端优化资产。受 AI 冲击而走弱的方向:廉价通用贴图、简单 2D sprite、通用代码片段——多位发布者指出"面向 hobbyist 的随机低价销售正在消退"(Makaka 的 Andrey Sirota:"random sales to hobbyists will fade away")。

### 3. 价格区间与付费意愿
- **免费**:引流为主(lite 版、样片包)。
- **低价 $5–$20**:单个特效包、小型图标/贴图包、单个 shader、小道具包。
- **中价 $20–$60**:成套 VFX 包、完整主题 UI 套件、中型环境/道具包、动画包。
- **高价 $60–$200+**:大型模块化环境包、完整角色系统、工具/编辑器扩展、完整项目模板;行业资产可达 $1,500(realvirtual Digital Twin Professional,据称已售约 4,000 份)。

官方与发布者共识:**定价过低会被读作低质**——Unity 官方"Start publishing"页原话:"The minimum price for an asset is $4.99... We encourage publishers to avoid undercutting other publishers' prices, as lower prices can indicate lower quality";且廉价包在搜索排序中通常排不到前面;Top 10% 发布者基本设定了各品类的均价基准。买家以独立开发者、小工作室为主,但他们"为节省时间/获得新能力而付费"的意愿很强——价值沟通(demo、视频、文档)比绝对低价更重要。单资产 vs 资产包:成套、风格统一的"包"普遍比零散单品卖得好、单价更高。

### 4. 竞争格局与切入难度
- **极度红海、头部垄断**:通用低多边形 3D(Synty 几乎占满该生态位,Polycount 讨论指其"fully occupy this specific niche already")、通用贴图/材质(5,480 个)、基础图标(3,313 个)、通用武器/家具道具(武器 3,583)。新人靠"做得一样"无法冒头。
- **高技术壁垒、竞争适中、毛利高**:着色器与技术型 VFX(着色器编程门槛高,做的人少);但顶级水体/植被 shader 已被 Staggart 等专家占据,需找细分。
- **相对蓝海**:风格化特效包中"特定题材/风格"的成体系内容、未被覆盖主题的模块化场景/道具套件、主题化完整 UI 套件(科幻/恐怖/休闲移动端)、特定品类 mocap 动画。

对单人/小团队而言,**制作工作量可控、可复用、可批量产出**的是:粒子特效(同一套着色器+贴图可衍生大量变体)、图标/UI 元素(模板化批产)、模块化道具/环境(套件化)。高成本、迭代慢的是:写实高模角色、大型完整环境、复杂工具(需持续技术支持)。

### 5. 三大方向性价比矩阵(制作成本 / 市场需求 / 竞争 / 定价潜力)
- **VFX —— 首选「风格化粒子特效包」(弹道/技能/打击/爆炸/光环)**:需求大(RPG/动作/移动端刚需)、制作成本中等且高度可复用、竞争适中(有 Hovl、Archanor 等强者但题材远未穷尽)、定价 $10–$30 且易做系列与捆绑。次选「细分着色器」(若有技术力):毛利高、竞争少,但门槛高。
- **2D —— 首选「主题化完整 UI 套件」**:需求刚需、付费意愿高(可卖 $20–$70,Michsky 即证明)、竞争适中(通用 UI 红海,但风格化成套仍有空间)、可复用模板化。次选「成套游戏图标包」(批产快,但单价低、红海)。**应避免**:通用贴图/材质(红海 + AI 冲击)。
- **3D —— 首选「未被覆盖主题的模块化场景/道具套件」**:需求大、套件化可复用、定价 $30–$200。但**避免**与 Synty 正面竞争的通用低多边形,以及通用武器/家具单品(红海)。次选「特定题材 mocap 动画包 / 风格化生物」:竞争适中、可复用。

### 6. 平台机制与变现现实
- **分成**:固定 70/30,创作者拿 70%,无发布费,最低定价 $4.99。对比竞品 Unity 分成更低:Epic 的 **Fab/前 Unreal Marketplace 为 88/12**(Epic 官方:"creators... will now receive 88% of their product sales... applies to all transactions");**Sketchfab 已并入 Fab 并同步提升至 88%**(Sketchfab 官方:"we increased our seller revenue share to 88% (it had previously been 70%)")。Unity 的 70/30 劣势靠庞大基数与编辑器内一键购买的低摩擦弥补:官方"Start publishing"页称可触及 **"over 1.7 million monthly Asset Store users"** 与 **"over 12,000 active publishers"**;活跃 Unity 开发者约 330 万(3.3 million active Unity developers,据 Generalist Programmer 2026 指南)。
- **发布门槛**:需 Unity 账号 + 填写 Publisher 资料 + 税务问卷;须有**展示相关作品的活跃个人网站**(Submission Guidelines 4.1.b 要求"actively maintained website";itch.io/marketplace 链接不被接受);3D/2D/VFX/Animation/Template 类必须含 demo 场景(1.1.f)。
- **审核**:Unity 策展团队人工审核;VOiD1 Gaming 指南原话:"Previously it takes nearly 12-18 business days to get the asset pack reviewed, however, now it is said to be 3-4 days but that depends on the Asset pack itself"(其他来源称 2–4 周);严格按 Submission Guidelines,易被打回。
- **技术要求(2026)**:新资产须用 Unity 2022.3+(1.3.a);用 Editor 6.5+ 提交的新资产/更新默认须支持 URP(1.3.c);AI 生成内容允许但须透明披露并带元数据标记。
- **提高曝光的因素**:YouTube 演示视频(头部发布者称带来 30–50% 流量)、评分与评论、免费 lite 版引流、定期更新、支持 URP/HDRP、SEO 友好的描述与个人网站、参与官方 Sale。
- **收入现实**:长尾分布(Generalist Programmer 2026:"Revenue on the Asset Store follows a long-tail distribution. A small percentage of publishers earn the majority of total marketplace revenue";中坚机会"the mid-tier opportunity ($1,000 to $5,000/month) is achievable for dedicated creators")。论坛自述案例:Dark Tonic(jerotas)称正常月 $1,000–$2,000、被选入 Sale 月 $5,000–$9,000;另一发布者 greggtwep16 自述约第 250 名、月均约 $1,000;原帖作者一个 GUI 插件 15 个月仅 $50;头部 Procedural Worlds(Gaia)年入约 $1M。发布者反复强调:第十个资产帮你卖出第一个;深耕单一细分(成为"那个做 X 的人")比广撒网更赚钱。销量代理换算上,多位发布者自述"销量:评分"约 10:1 到 25:1(JohnnyA 自述 2D 美术资产约 25:1,工具约 10–20:1)——据此推算 Staggart Stylized Water 2(253 评分)粗略对应数千份销量,Hovl Epic Toon VFX 2(12 评分)对应约 120–300 份。

## Details
本报告数据来源分三层:
1. **一手权威**:Unity 官方 Asset Store 页面(各子类实时 facet 计数)、Submission Guidelines、Start publishing/Finding the right price 官方页、Unity 博客(AI Marketplace、Top selling assets)、Unity Manual(revenue、URP 兼容)。
2. **发布者一手经验**:Unity Discussions 论坛"How much asset store publishers earn"与"ratings to sales ratio"主题帖;Makaka(Andrey Sirota)、Exoa、Darko Unity 访谈/教程;Polycount 关于 Synty 为何畅销的讨论。
3. **二手聚合(需谨慎)**:Generalist Programmer 2026 销售指南、Market Clarity 发布者收入盘点等——其中部分收入数字为作者估算而非发布者自述。

各品类规模、价格带、竞争与销量代理证据已在 Key Findings 各节展开;核心判断是:**艺术侧的成功来自"成体系的、有明确风格/题材定位的资产库",而非单个高工时单品**——这是 Synty(低多边形全套)、Staggart(风格化水体/植被)、Hovl(toon 特效)、Michsky(成套 UI)共同验证的模式。

## Recommendations
1. **先做一个风格化 VFX 特效包作为切入点**(成本可控、需求刚需、定价合理):聚焦一个明确题材(如"卡通 RPG 技能特效"或"科幻能量武器特效"),50–150 个 prefab,统一着色器+可调色,定价 $15–$25,同时发一个免费小包引流。基准:若 3 个月内评分达到两位数、收藏破千,即验证成功,应立刻做 Vol.2 与捆绑包(对标 Hovl 系列做法)。
2. **并行用 2D 能力做主题化完整 UI 套件**(科幻/恐怖/休闲移动端任选其一),含按钮、面板、图标、字体配套,定价 $25–$50。基准:对标 Michsky 单品评分 100+ 即为强信号;可向上做 $60+ 的"complete" 版本与全集捆绑。
3. **3D 暂缓做通用资产**;若投入,选一个 Synty 未覆盖或覆盖薄弱的具体主题做模块化套件,定价 $40+。避免与低多边形通用包正面竞争。
4. **建立体系而非单品**:同一风格下持续出 3–5 个互补资产,做交叉销售与升级捆绑(发布者公认"第十个资产帮你卖出第一个")。
5. **全部资产默认支持 URP(必要时附 HDRP)、基于 Unity 2022.3+/Unity 6**,配 YouTube demo、完善文档、个人网站(发布硬性要求)。
6. **触发重做决策的阈值**:若某品类 6–12 个月仍无法稳定月销(评分增长停滞、收藏低迷),转向相邻细分;若 AI 工具已能廉价覆盖你的低端品类(如简单贴图),立即上移到更技术化/成体系的高端内容。

## Caveats
- 店内子类资产数量为 2026 年 6 月实时筛选器计数,会随时变动;部分 facet 计数在 2D/3D 视图下共享,存在口径模糊。
- 评分数、收藏数只是销量的间接代理;"销量:评分≈10:1–25:1"为发布者自述(多来自较早年份,如 2016/2021 论坛帖),非官方数据;收藏≠销量;免费资产数据(如 Synty Starter Pack 4,700 收藏)严重偏高。
- 个体收入数字多为论坛自述或第三方聚合站(Market Clarity、Generalist Programmer 等)的估算,Unity 不公开单个发布者销售数据,需谨慎对待;NatureManufacture、Pete Sekula 等艺术发布者的具体收入为第三方推测而非本人披露。
- AI 对低端艺术品类的冲击是当前共识趋势但仍在演变,具体影响程度尚无权威量化;Unity 官方调查同时显示部分用户因使用 AI 而在 Asset Store 花费更多。
- 竞品分成数据(Fab/Sketchfab 88/12)反映的是更优分成,但其受众结构(Unreal 偏 AAA/企业、Sketchfab 偏跨引擎与非游戏)与 Unity 不同,不能简单类比迁移。