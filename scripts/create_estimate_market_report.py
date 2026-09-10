from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "seishuya_estimate_market_review.pdf"

FONT_REGULAR = "/Users/tai/Library/Fonts/GenShinGothic-Normal.ttf"
FONT_BOLD = "/Users/tai/Library/Fonts/GenShinGothic-Bold.ttf"

INK = colors.HexColor("#2B2824")
BROWN = colors.HexColor("#493C31")
TAN = colors.HexColor("#B69570")
CREAM = colors.HexColor("#F5F0E8")
PALE = colors.HexColor("#FBF8F3")
GREEN = colors.HexColor("#476451")
AMBER = colors.HexColor("#A16B24")
RED = colors.HexColor("#9A4B45")
LINE = colors.HexColor("#D8CEC1")
MUTED = colors.HexColor("#6F675F")


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("GenShin", FONT_REGULAR))
    pdfmetrics.registerFont(TTFont("GenShinBold", FONT_BOLD))


def p(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(text, style)


def footer(canvas, doc) -> None:
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.4)
    canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
    canvas.setFont("GenShin", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9.5 * mm, "LANDSCAPE COFFEE | 仕入価格レビュー")
    canvas.drawRightString(width - 18 * mm, 9.5 * mm, f"{doc.page}")
    canvas.restoreState()


def make_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="GenShinBold",
            fontSize=25,
            leading=34,
            textColor=BROWN,
            alignment=TA_LEFT,
            spaceAfter=9 * mm,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            fontName="GenShin",
            fontSize=11,
            leading=19,
            textColor=MUTED,
        ),
        "h1": ParagraphStyle(
            "h1",
            fontName="GenShinBold",
            fontSize=17,
            leading=23,
            textColor=BROWN,
            spaceBefore=2 * mm,
            spaceAfter=4 * mm,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName="GenShinBold",
            fontSize=12,
            leading=17,
            textColor=GREEN,
            spaceBefore=4 * mm,
            spaceAfter=2.5 * mm,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="GenShin",
            fontSize=9.3,
            leading=16,
            textColor=INK,
            spaceAfter=2.5 * mm,
        ),
        "small": ParagraphStyle(
            "small",
            fontName="GenShin",
            fontSize=7.8,
            leading=12,
            textColor=MUTED,
        ),
        "callout": ParagraphStyle(
            "callout",
            fontName="GenShinBold",
            fontSize=13,
            leading=21,
            textColor=BROWN,
            alignment=TA_LEFT,
        ),
        "cell": ParagraphStyle(
            "cell",
            fontName="GenShin",
            fontSize=7.7,
            leading=11.2,
            textColor=INK,
        ),
        "cell_bold": ParagraphStyle(
            "cell_bold",
            fontName="GenShinBold",
            fontSize=7.7,
            leading=11.2,
            textColor=INK,
        ),
        "head": ParagraphStyle(
            "head",
            fontName="GenShinBold",
            fontSize=7.5,
            leading=10,
            textColor=colors.white,
            alignment=TA_CENTER,
        ),
        "source": ParagraphStyle(
            "source",
            fontName="GenShin",
            fontSize=7.7,
            leading=13,
            textColor=INK,
            leftIndent=4 * mm,
            firstLineIndent=-4 * mm,
            spaceAfter=1.8 * mm,
        ),
    }


def verdict_color(verdict: str):
    if "高い" in verdict or "確認" in verdict:
        return RED
    if "安い" in verdict or "良い" in verdict:
        return GREEN
    if "定価" in verdict:
        return AMBER
    return BROWN


def price_table(rows, styles, widths=(48, 24, 27, 76)) -> Table:
    data = [[
        p("商品", styles["head"]),
        p("提示価格", styles["head"]),
        p("評価", styles["head"]),
        p("相場との比較・コメント", styles["head"]),
    ]]
    for item, price, verdict, comment in rows:
        verdict_style = ParagraphStyle(
            f"v_{len(data)}",
            parent=styles["cell_bold"],
            textColor=verdict_color(verdict),
            alignment=TA_CENTER,
        )
        data.append([
            p(item, styles["cell_bold"]),
            p(price, styles["cell"]),
            p(verdict, verdict_style),
            p(comment, styles["cell"]),
        ])
    table = Table(data, colWidths=[w * mm for w in widths], repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BROWN),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 1), (2, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return table


def summary_box(styles) -> Table:
    content = [
        p("総合判定", styles["small"]),
        p("全体は妥当。ただし、業務用だから一律に安い価格表ではない。", styles["callout"]),
        p(
            "定番酒・ビール・一部ウイスキーは良心的。限定酒やクラフト系は定価同等。高級シャンパンは銘柄ごとの差が大きく、相見積が有効。",
            styles["body"],
        ),
    ]
    box = Table([[content]], colWidths=[175 * mm])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CREAM),
        ("BOX", (0, 0), (-1, -1), 0.8, TAN),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return box


def build_pdf() -> None:
    register_fonts()
    styles = make_styles()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=17 * mm,
        bottomMargin=19 * mm,
        title="勢州屋 得意先単価表 市場価格レビュー",
        author="LANDSCAPE COFFEE",
        subject="2026年7月時点の公開小売価格・希望小売価格との比較",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates([PageTemplate(id="report", frames=[frame], onPage=footer)])

    story = []
    story += [
        Spacer(1, 17 * mm),
        p("LANDSCAPE COFFEE", styles["subtitle"]),
        Spacer(1, 3 * mm),
        p("勢州屋 得意先単価表<br/>市場価格レビュー", styles["title"]),
        p("対象資料: 勢州屋見積.pdf（2026年7月13日付）<br/>調査基準日: 2026年7月15日", styles["subtitle"]),
        Spacer(1, 17 * mm),
        summary_box(styles),
        Spacer(1, 9 * mm),
        p("この資料の見方", styles["h2"]),
        p(
            "提示価格は原資料に記載された税込・空容器代込み価格。比較対象はメーカー希望小売価格と、送料・ポイントを除く公開小売価格の概況です。地域、正規・並行輸入、箱、ヴィンテージ、配送条件により実際の調達価格は変動します。",
            styles["body"],
        ),
        p(
            "原資料は数量・総額のある発注見積ではなく、LANDSCAPE COFFEE向けの得意先単価マスタです。「新売価 0」は無料ではなく、改定価格が未登録と考えられます。",
            styles["body"],
        ),
        Spacer(1, 8 * mm),
        p("先に確認すべき3点", styles["h2"]),
        price_table([
            ("saku 2商品", "2,970円", "要確認", "JANコード上は300ml。単価表の500ml表記は誤記の可能性が高い。原価計算へ直結するため発注前に訂正依頼。"),
            ("こだわり酒場", "2,852円", "要確認", "家庭向け25度1.8Lなら割高。業務用40度コンクなら妥当な可能性があるため、度数とJANを確認。"),
            ("高級シャンパン", "銘柄別", "相見積", "正規・並行、箱、ヴィンテージ、保管条件を揃えて比較。特にアルマンドは公開相場との差が大きい。"),
        ], styles, widths=(45, 25, 28, 77)),
    ]

    story += [PageBreak(), p("1. 日本酒・焼酎・ビール", styles["h1"])]
    story += [
        p("日本酒", styles["h2"]),
        price_table([
            ("大天狗 特別純米 720ml", "1,980円", "妥当", "公開小売も税込1,980円前後。卸値メリットはほぼない。"),
            ("廣戸川 大吟醸 720ml", "4,000円", "妥当", "地酒の正規価格帯。目立つプレミア上乗せは見られない。"),
            ("奥の松 特別純米 720ml", "1,200円", "安い", "一般小売1,320円前後に対して約9%安い。"),
            ("奥の松 十八代伊兵衛 720ml", "5,940円", "定価同等", "メーカー系の税込価格と同額。"),
        ], styles),
        p("焼酎", styles["h2"]),
        price_table([
            ("茉莉花 20度 500ml", "668円", "安い", "希望小売は税別660円、税込726円。約8%安い。"),
            ("キンミヤ 25度 1.8L", "1,580円", "妥当", "市場は概ね1,570円台から1,700円程度。下限に近い。"),
            ("キンミヤ 25度 720ml", "680円", "安い", "一般小売680円から720円程度。下限水準。"),
            ("DAIYAME 900ml", "1,480円", "安い", "現行希望小売税込1,625円に対して約9%安い。"),
            ("DAIYAME 1.8L", "2,750円", "安い", "現行希望小売税込3,085円に対して約11%安い。"),
            ("GLOW EP05 720ml", "1,760円", "定価同等", "一般販売価格と同額。限定品としては妥当。"),
            ("GLOW EP05 1.8L", "3,630円", "定価同等", "一般販売価格と同額。限定品としては妥当。"),
        ], styles),
        p("ビール", styles["h2"]),
        price_table([
            ("スーパードライ 中瓶500ml", "285円", "安い", "飲食店仕入れとして良好。"),
            ("同 20本ケース", "5,900円", "安い", "1本換算295円、P箱代込み。公開相場は概ね5,940円から6,747円。"),
            ("サッポロラガー 中瓶500ml", "290円", "安い", "妥当な業務用価格。"),
            ("同 20本ケース", "5,980円", "安い", "1本換算299円。容器込みなら問題なし。"),
        ], styles),
        p("確認メモ: 空瓶・P箱の返却時に、容器代が返金または次回相殺されるかを取引条件として確認する。", styles["small"]),
    ]

    story += [PageBreak(), p("2. シャンパン・ワイン・ウイスキー", styles["h1"])]
    story += [
        p("シャンパン・ワイン", styles["h2"]),
        price_table([
            ("ドン・ペリニヨン 750ml", "31,500円", "やや高い", "公開最安約24,600円。正規品・箱・ヴィンテージ条件によっては妥当。"),
            ("クリュッグ ロゼ エディション", "59,800円", "妥当", "正規参考価格は税込64,240円程度。正規流通なら悪くない。"),
            ("クリュッグ グランド・キュヴェ", "39,800円", "やや高い", "通常品の公開実勢は概ね30,000円から34,000円。"),
            ("アルマン・ド・ブリニャック ゴールド", "52,500円", "高い", "公開相場は概ね32,700円から38,000円。条件を揃えた相見積を推奨。"),
            ("フランジア 赤 3L", "2,400円", "やや安い", "一般販売約2,497円。"),
            ("フランジア 白 3L", "2,400円", "やや安い", "一般販売約2,497円。"),
        ], styles),
        Spacer(1, 3 * mm),
        p("高級シャンパンの比較条件", styles["h2"]),
        p(
            "正規輸入か並行輸入か、箱・巾着の有無、ヴィンテージまたはエディション、保管履歴、納期を一致させて比較する。単純な最安値だけでは品質・再調達性を評価できない。",
            styles["body"],
        ),
        p("ウイスキー", styles["h2"]),
        price_table([
            ("角瓶 700ml", "1,850円", "安い", "公開市場は概ね1,890円から2,100円。"),
            ("山崎 NV 700ml", "8,250円", "良い", "ほぼ希望小売水準。市場では入手難による上乗せがある。"),
            ("白州 NV 700ml", "8,250円", "良い", "ほぼ希望小売水準。市場では入手難による上乗せがある。"),
            ("響 JAPANESE HARMONY", "8,800円", "良い", "2026年改定後の希望小売価格と同額。"),
            ("知多 700ml", "6,600円", "定価同等", "公式税込価格と同額。"),
        ], styles),
        Spacer(1, 4 * mm),
        p(
            "山崎・白州・響は価格より供給確度が重要。原資料にもメーカー出荷規制による欠品可能性が明記されているため、メニュー常設時は代替銘柄または売切運用を決めておく。",
            styles["body"],
        ),
    ]

    story += [PageBreak(), p("3. サワー・シロップ・割り材", styles["h1"])]
    story += [
        p("サワー・梅酒・シロップ", styles["h2"]),
        price_table([
            ("鬼シリーズ各種 1.8L", "各4,128円", "定価同等", "果肉入り業務用商品の参考価格帯。卸値メリットは薄い。"),
            ("こだわり酒場 レモンサワーの素 1.8L", "2,852円", "要確認", "家庭向け25度品なら割高。業務用40度コンクなら妥当な可能性。度数とJANを確認。"),
            ("The CHOYA 熟成一年 700ml", "1,050円", "安い", "希望小売は税別1,050円、税込1,155円。約9%安い。"),
            ("すっかいがな 500ml", "1,350円", "やや安い", "一般小売約1,430円。"),
            ("すっかいがな 1.8L", "4,000円", "妥当", "業務用として自然な価格。"),
            ("七福神シロップ 4種 710ml", "各1,912円", "定価同等", "参考税別1,770円に食品8%を加えた金額と一致。"),
        ], styles),
        p("ソフトドリンク・割り材", styles["h2"]),
        price_table([
            ("ウィルキンソン ジンジャエール 500ml", "198円", "妥当", "単品業務用価格として標準的。"),
            ("アサヒシロップ GF 600ml", "410円", "妥当", "一般流通価格とほぼ同じ。"),
            ("アサヒシロップ レモン 600ml", "410円", "妥当", "一般流通価格とほぼ同じ。"),
            ("ウィルキンソン炭酸 190ml", "110円", "妥当", "容器込み市場価格は約112円。"),
            ("同 24本ケース", "2,700円", "安い", "公開市場は概ね2,786円から2,911円。"),
            ("ジンジャエール 190ml", "125円", "妥当", "標準的な業務用価格。"),
            ("同 24本ケース", "3,100円", "妥当", "ケース・容器込みなら問題なし。"),
        ], styles),
        p("saku クラフトビネガー", styles["h2"]),
        price_table([
            ("saku Komezu Fruity", "2,970円", "定価同等", "公式小売と同額。ただしJANコード上は300mlで、単価表の500ml表記は要訂正。"),
            ("saku Kurozu Spicy", "2,970円", "定価同等", "公式小売と同額。こちらも公式容量は300ml。"),
        ], styles),
        p(
            "原価例: 300ml・2,970円を7倍希釈し、200mlで提供する場合、原液原価は1杯約283円。500mlと誤認すると原価設計が大きくずれる。",
            styles["body"],
        ),
    ]

    story += [PageBreak(), p("4. 採用判断と確認事項", styles["h1"])]
    action_data = [
        [p("判断", styles["head"]), p("対象", styles["head"]), p("理由・次のアクション", styles["head"])],
        [p("積極採用", styles["cell_bold"]), p("ビール、DAIYAME、茉莉花、奥の松 特別純米、角瓶、山崎・白州・響", styles["cell"]), p("価格条件が良好。希少ウイスキーは納品本数と頻度を確認。", styles["cell"])],
        [p("通常採用", styles["cell_bold"]), p("地酒限定品、GLOW、フランジア、割り材、七福神、saku", styles["cell"]), p("価格は妥当または定価同等。配送利便性や小口対応を含めて判断。", styles["cell"])],
        [p("相見積", styles["cell_bold"]), p("ドンペリ、クリュッグ グランド・キュヴェ、アルマンド", styles["cell"]), p("輸入条件・付属品・保管条件を揃え、2社以上で比較。", styles["cell"])],
        [p("仕様確認", styles["cell_bold"]), p("こだわり酒場、saku、空容器", styles["cell"]), p("度数・JAN・容量・容器返金条件を書面で確認。", styles["cell"])],
    ]
    actions = Table(action_data, colWidths=[27 * mm, 66 * mm, 82 * mm], repeatRows=1)
    actions.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BROWN),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story += [actions, Spacer(1, 8 * mm)]
    story += [
        p("酒販店へ確認する質問", styles["h2"]),
        p("1. sakuの容量は300mlか500mlか。該当JANと商品規格書を提示してください。", styles["body"]),
        p("2. こだわり酒場 レモンサワーの素は何度の商品か。家庭向け25度品と業務用40度コンクのどちらか。", styles["body"]),
        p("3. 高級シャンパンは正規輸入か並行輸入か。箱・巾着、ヴィンテージ／エディション、納期を明記してください。", styles["body"]),
        p("4. ビール瓶、ジュース瓶、P箱の保証金は返却時に返金されるか、次回請求と相殺されるか。", styles["body"]),
        p("5. 山崎・白州・響は月あたり何本まで、どの程度の頻度で入荷可能か。欠品時の代替運用はあるか。", styles["body"]),
        Spacer(1, 6 * mm),
        summary_box(styles),
        Spacer(1, 7 * mm),
        p("最終所見", styles["h2"]),
        p(
            "定番商品の配送・空容器回収まで含む地域酒販店としては、十分妥当な単価表。高級シャンパンとクラフト商品まで一社にまとめると割高になりやすいため、定番品は勢州屋、高額輸入品は都度比較という使い分けが合理的。",
            styles["body"],
        ),
    ]

    story += [PageBreak(), p("参考情報", styles["h1"])]
    sources = [
        ("サントリー 茉莉花 商品概要", "https://www.suntory.co.jp/news/article/14428.html"),
        ("濵田酒造 商品カタログ（DAIYAME）", "https://www.hamadasyuzou.co.jp/denzouin/wp-content/themes/hamadasyuzou/pdf/catalog_shochu.pdf"),
        ("奥の松 十八代伊兵衛", "https://www.meimonshu.jp/modules/sakemap3/index.php?lid=259&page=sakedetail"),
        ("CHOYA 熟成一年 公式商品情報", "https://www.choya.co.jp/products/umeshu/the_choya1/"),
        ("サントリー 知多 公式販売", "https://ieno-bar.suntory.co.jp/shopdetail/000000000368/"),
        ("アサヒ スーパードライ中瓶 価格比較", "https://kakaku.com/item/K0000661324/"),
        ("ドン・ペリニヨン 価格比較", "https://kakaku.com/item/S0000850719/"),
        ("クリュッグ グランド・キュヴェ 価格比較", "https://kakaku.com/item/S0000197819/"),
        ("アルマン・ド・ブリニャック ゴールド 価格比較", "https://kakaku.com/item/S0000835929/"),
        ("フランジア白 3L 公開販売価格", "https://www.kakuyasu.co.jp/store/commodity/0010/00065631/"),
        ("ウィルキンソン炭酸190ml 公開販売価格", "https://www.kakuyasu.co.jp/store/commodity/0010/00001426/"),
        ("saku Komezu Fruity 公式取扱ページ", "https://www.nakagawa-masashichi.jp/shop/g/g4960261600004/"),
    ]
    story += [
        p("価格評価の根拠として参照した主なメーカー公式情報・公開販売価格。価格は調査時点の表示であり、在庫や販売条件により変動します。", styles["body"]),
        Spacer(1, 2 * mm),
    ]
    for index, (label, url) in enumerate(sources, start=1):
        story.append(p(f'{index}. <link href="{url}" color="#476451">{label}</link><br/><font color="#6F675F">{url}</font>', styles["source"]))

    story += [
        Spacer(1, 8 * mm),
        p("免責", styles["h2"]),
        p(
            "本資料は公開情報に基づく仕入判断の補助資料です。売買条件、品質、真正性、継続供給を保証するものではありません。発注前に商品規格、納期、返品・空容器条件を取引先へ確認してください。",
            styles["small"],
        ),
    ]

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
