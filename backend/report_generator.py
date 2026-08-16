from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)
from reportlab.lib.units import inch


def generate_pdf_report(batch_data, output_path="evaluation_report.pdf"):

    summary = batch_data.get("summary", {})
    results = batch_data.get("results", [])

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=20,
        spaceAfter=20,
    )

    heading_style = ParagraphStyle(
        "HeadingStyle",
        parent=styles["Heading2"],
        fontSize=14,
        spaceBefore=15,
        spaceAfter=10,
    )

    normal_style = ParagraphStyle(
        "NormalStyle",
        parent=styles["Normal"],
        fontSize=9,
        leading=13,
    )

    story = []

    # --------------------------------------------------
    # PROJECT DETAILS
    # --------------------------------------------------

    story.append(
        Paragraph(
            "AI Response Quality Evaluation Report",
            title_style,
        )
    )

    story.append(
        Paragraph(
            "AI Response Validation System with Hallucination Detection Assistance",
            normal_style,
        )
    )

    story.append(Spacer(1, 15))

    story.append(
        Paragraph(
            "Project Details",
            heading_style,
        )
    )

    project_data = [
        ["Project", "AI Response Quality Evaluator Agent"],
        ["Report Type", "Batch Evaluation Report"],
        ["Total Evaluations", str(summary.get("total_evaluations", 0))],
    ]

    project_table = Table(
        project_data,
        colWidths=[2 * inch, 4 * inch],
    )

    project_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )

    story.append(project_table)

    # --------------------------------------------------
    # BATCH SUMMARY
    # --------------------------------------------------

    story.append(
        Paragraph(
            "Batch Summary",
            heading_style,
        )
    )

    summary_data = [
        ["Metric", "Value"],
        [
            "Total Evaluations",
            str(summary.get("total_evaluations", 0)),
        ],
        [
            "Pass",
            str(summary.get("pass_count", 0)),
        ],
        [
            "Needs Improvement",
            str(summary.get("needs_improvement_count", 0)),
        ],
        [
            "Fail",
            str(summary.get("fail_count", 0)),
        ],
        [
            "Average Relevance",
            str(summary.get("average_relevance", 0)),
        ],
        [
            "Average Accuracy",
            str(summary.get("average_accuracy", 0)),
        ],
        [
            "Average Completeness",
            str(summary.get("average_completeness", 0)),
        ],
        [
            "Average Hallucination",
            str(summary.get("average_hallucination", 0)),
        ],
        [
            "Average Overall Score",
            str(summary.get("average_overall", 0)),
        ],
    ]

    summary_table = Table(
        summary_data,
        colWidths=[3.5 * inch, 2.5 * inch],
    )

    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )

    story.append(summary_table)

    # --------------------------------------------------
    # INDIVIDUAL EVALUATIONS
    # --------------------------------------------------

    story.append(
        Paragraph(
            "Individual Evaluation Results",
            heading_style,
        )
    )

    for index, result in enumerate(results, start=1):

        story.append(
            Paragraph(
                f"Evaluation {index}",
                styles["Heading3"],
            )
        )

        question = str(result.get("question", ""))
        response = str(result.get("response", ""))

        relevance = result.get("relevance_score", result.get("relevance", 0))
        accuracy = result.get("accuracy_score", result.get("accuracy", 0))
        completeness = result.get(
            "completeness_score",
            result.get("completeness", 0),
        )
        hallucination = result.get(
            "hallucination_score",
            result.get("hallucination", 0),
        )

        overall = result.get("overall_score", 0)
        verdict = result.get("verdict", "Unknown")

        evaluation_data = [
            ["Question", question],
            ["Response", response],
            ["Relevance", str(relevance)],
            ["Accuracy", str(accuracy)],
            ["Completeness", str(completeness)],
            ["Hallucination", str(hallucination)],
            ["Overall Score", str(overall)],
            ["Verdict", str(verdict)],
        ]

        evaluation_table = Table(
            evaluation_data,
            colWidths=[1.5 * inch, 4.5 * inch],
        )

        evaluation_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("FONTSIZE", (0, 0), (-1, -1), 8),
                    ("PADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )

        story.append(evaluation_table)
        story.append(Spacer(1, 12))

    # --------------------------------------------------
    # FLAGGED / HALLUCINATED RESPONSES
    # --------------------------------------------------

    story.append(PageBreak())

    story.append(
        Paragraph(
            "Flagged / Hallucinated Responses",
            heading_style,
        )
    )

    hallucinated_found = False

    for index, result in enumerate(results, start=1):

        hallucination_score = result.get(
            "hallucination_score",
            result.get("hallucination", 0),
        )

        try:
            hallucination_score = float(hallucination_score)
        except (ValueError, TypeError):
            hallucination_score = 0

        # Lower hallucination score indicates higher hallucination risk
        if hallucination_score < 5:

            hallucinated_found = True

            response = str(result.get("response", ""))

            story.append(
                Paragraph(
                    f"<b>Evaluation {index}</b>",
                    normal_style,
                )
            )

            story.append(
                Paragraph(
                    f"H hallucination score: {hallucination_score}",
                    normal_style,
                )
            )

            story.append(
                Paragraph(
                    f"Response: {response}",
                    normal_style,
                )
            )

            story.append(Spacer(1, 10))

    if not hallucinated_found:
        story.append(
            Paragraph(
                "No high-risk hallucinated responses were detected.",
                normal_style,
            )
        )

    # --------------------------------------------------
    # IMPROVEMENT RECOMMENDATIONS
    # --------------------------------------------------

    story.append(
        Paragraph(
            "Improvement Recommendations",
            heading_style,
        )
    )

    recommendations = [
        "Improve factual accuracy by grounding responses in reliable reference information.",
        "Improve relevance by ensuring responses directly address the user's question.",
        "Improve completeness by covering all important aspects of the question.",
        "Reduce hallucinations by using retrieved knowledge-base context.",
        "Review responses classified as Needs Improvement or Fail.",
    ]

    for recommendation in recommendations:
        story.append(
            Paragraph(
                f"• {recommendation}",
                normal_style,
            )
        )
        story.append(Spacer(1, 4))

    # --------------------------------------------------
    # BUILD PDF
    # --------------------------------------------------

    doc.build(story)

    return output_path