# Case study audit — evidence dossier

Internal file: traces every claim published in the case studies back to a source.
Reviewed on 2026-10-19. Repositories cloned read-only (shallow, files < 2 MB) from
`github.com/JadFalaq`; the commit reviewed is given for each project.

Legend — **Docs**: level of documentation available. **Status**: what was published.

| # | Project (id) | Slug | Repository @ commit | Docs | Status |
|---|---|---|---|---|---|
| 1 | Intelligent Audit (audit) | `akwa-audit-intelligent` | Audit-Intelligent @ b98bf4a + 44-p. report + 28-slide deck | High | Dedicated case study (reference) |
| 2 | Renault Digital (renault) | `renault-digital-genai-qa` | none (internal) — portfolio experience text only | Medium | Case study from published experience text only |
| 3 | cvmatch (cvmatcher) | `cvmatch` | cv-matcher @ 9015ab7 | High | Full case study |
| 4 | RAG strategies (ragchatbot) | `rag-strategies` | Comparing-RAG-Strategies-… @ c9972d0 | Medium | Full case study (no metrics) |
| 5 | Book pipeline (bookpipeline) | `airflow-book-pipeline` | Pipeline-d-Ingestion-… @ ccbd8fb + project report (md) | Medium | Full case study |
| 6 | Snani — dental MLOps (dental) | `snani-dental-mlops` | detection_dentaire_mlops @ 9fb9487 + 24-slide deck | High | Full case study |
| 7 | AraBERT misinformation (misinformation) | `arabert-medical-misinformation` | misinformation_covid_detector_arabic @ c8dc5bd | High | Full case study |
| 8 | PointFed3D (pointfed) | `pointfed-federated-3d` | Federated-PointCloud-3D @ d88a441 | Code: high / results: **not verifiable** | Case study without results |
| 9 | AmnAI (shoplifting) | `amnai-shoplifting-detection` | AmnAI_Vlast @ 37e25d6 + 10-p. report | Medium | Full case study (no metrics) |
| 10 | Deep Learning series (deeplearning) | `deep-learning-perceptrons-to-distillation` | Deep-Learning-From-Perceptrons-… @ 2f9b48f | High | Full case study |
| 11 | U-Net segmentation (segmentation) | `unet-semantic-segmentation` | Segmentation_Image @ e61dd9a | Low–medium | Short case study |
| 12 | Chance-constrained SVM (ccsvm) | `chance-constrained-svm` | Chance-Constrained-SVM @ 3a426cf | Medium | Short case study |
| 13 | Speaker recognition (speaker) | `speaker-recognition-radio` | Detection_de_locuteur_… @ 3eeaa3b + 36-p. report (OCR) | Medium | Full case study |
| 14 | Motorcycle import (motoscraper) | `motorcycle-import-scraper` | Profitable_Motorcycle_Import_Scraper @ b911005 + 57-p. report | Medium | Full case study |
| 15 | Smart irrigation (irrigation) | `smart-irrigation-system` | Smart_Irrigation_System @ 64c9442 | Medium | Full case study (no metrics) |

All 15 projects listed in `data/content.ts` are covered; no repository outside the portfolio was used.

---

## 1. Intelligent Audit — AKWA Group
See `data/akwa.ts` header. Report Tables 3.4–3.5, 3.7, 3.8–3.12, §3.3.4, §3.4.1, §3.4.5, §3.5; code
`RandomForestClassifier.py` (n_estimators=200, class_weight='balanced', non-stratified split).
- **Corrected**: "6M+ SQL records" removed (absent from all sources; Afriware = 482,672 lines);
  PostgreSQL removed (not used in code).
- **Contradictions not published**: Table 3.13 counts do not reconcile with Table 3.11; README says
  KNN macro recall 0.85 (report 0.84) and "F1 global 0.97".
- **Confidentiality**: public repo contains `data/Book1.csv` (482,672 rows) and the full report —
  to be reviewed by the owner. Deck slide 15 shows raw transactions → deck not published.

## 2. Renault Digital (internal)
Sources: the experience entries already published on the portfolio (`data/content.ts`). No code,
no screenshots, no internal document. The diagram only arranges components named in that text.
Needs owner validation before production.

## 3. cvmatch
README (layers, limits §5), `src/cvmatch/{graph,verification,retrieval,scoring,limits,api}.py`,
`config.py` (top_k=4, status weights), `.github/workflows/ci.yml` (pytest on Python 3.10/3.12, web
build, Docker build), `Dockerfile`.
- **Verified locally**: `pytest` → 125 collected, 124 passed, 1 skipped (optional langchain_openai).
- **Key limit (README)**: never run against a real LLM / embeddings; no real-LLM evaluation
  results versioned → no quality metric published.
- Demo `cv-offer-matcher.vercel.app` responds 200.

## 4. RAG strategies
11 scripts + notebook. Parameters from code: k=5 (k=3 in one script), score threshold 0.7 / 0.3
(commented), RRF k=60, character splitter 100/0, recursive 800/0, embeddings batch 16.
Corpus: 5 company text files + "Attention Is All You Need". `rag_results.json` holds 3 enriched
chunks, **not** an evaluation → comparison is qualitative only.

## 5. Book pipeline
`docker-compose.yml` (postgres, redis, webserver, scheduler, worker, triggerer, flower),
DAG `exercise2_books_ingestion.py` (retries=2, manual trigger, dynamic mapping `.expand`),
`ml_service/config.py` (flan-t5-base/large, nllb-200-distilled-600M, your_tts), `app.py`
(`min_questions=20` with top-up loop).
- "20+ Q&A" = enforced by design, not a measured result. "5–15 min per book" = self-reported in the
  project report without protocol. Academic exercise ("Exercise 2").

## 6. Snani — dental MLOps
Re-reviewed at `9fb9487b42017c3d008c8fbd4e532e4e03de5df2` using GitHub tree and
individual raw files. The full clone was stopped after a slow transfer; no application
or inference was run from the external repository.

- Owner-provided presentation: `Industrialisation d'un Système de Détection de Pathologies Dentaires — Approche MLOps.pdf`,
  24 physical PDF pages. Metrics were read visually from embedded Table 4.2 on **PDF page 14**
  (printed slide number 11); page 15 shows the registry. Page 19 reports Docker size and test counts.
- Data: 1,808 X-rays, 24,888 annotations, 3 invalid annotations removed, 14→7 classes.
  The 7 classes include treatments/devices, not just diseases. No claim that remapping balances classes.
- Champion baseline: eval P .695 R .393 mAP50 .325 mAP50–95 .136;
  test .860 / .467 / .422 / .211; external .682 / .383 / .325 / .146.
- Candidate: eval .689 / .368 / .313 / .138; test .894 / .441 / .407 / .199;
  external .757 / .383 / .332 / .160. These are experiment scores, not clinical accuracy.
- `configs/model_registry.yaml`: confirms Champion baseline, Candidate external-generalization
  and Archived small-lesions variants. `configs/train.yaml` currently describes the small-lesions
  experiment with additional augmentations; do not claim all experiments use only horizontal flips.
- `docs/deployment.md` + `.github/workflows/cd-service.yml`: current Azure Container Apps API
  (0–1 replica), Vercel frontend, GHCR image; Azure automatic deployment requires configured credentials.
  The PDF still shows the older Railway hosting and a production verification job now removed.
- Docker sizes 3.74 → 1.19 GB and 11+5 tests are explicitly attributed to the presentation,
  not presented as a new benchmark or current collected test count.
- `frontend/src/i18n/fr.js`, `components/ResultsPanel.jsx`, `report.js`: French/Arabic,
  upload/example/camera, plain-language findings, confidence, annotated-image download and sharing.
- Public demo HTML fetched successfully (title, description, French/Arabic metadata).
  A browser navigation waiting for network idle timed out; no patient X-ray was submitted and
  no claim of successful live inference is made. Backend cold-start range 30–60 s comes from deployment docs.
- PDF claim “<5s” not used as a latency metric. No clinical validation claimed.
- Presentation viewer uses 24 pre-rendered WebP pages, retaining the original PDF for opening/download.

## 7. AraBERT misinformation
`models/final_report.txt`, `improvements/COMPARATIVE_REPORT.md`, `baseline_report.txt`,
`config.yaml` (max_length 128, lr 2e-5, 5 epochs, seed 42).
- Final: accuracy 0.8687, macro F1 0.8685, threshold 0.70, 297 test tweets (after removing 617
  duplicates, 17.2 %).
- **Important**: on the same 359-tweet split before deduplication, TF-IDF baseline 0.9081 vs
  AraBERT 0.8942 → the baseline was not beaten. Card wording corrected.

## 8. PointFed3D — results not verifiable
Code for FedAvg (hand-written), VFL and KD is present (configs, scripts, notebooks).
- **The README's headline numbers (82.54 %, 79.78 %, 64.21 %, 76.84 %, 75.62 %, 71.30 %) are hard-coded
  in `outputs/generate_mock_results.py`, which also fabricates the training curves with
  `np.random`.** Real artefacts: ultra-quick runs at 2 % (chance level, 2 epochs) and one
  `federated_iid_results.json` at 53.9 % / macro 15.9 % (different parameter count) that does not
  match the README.
- **Decision**: no metric published anywhere on the site; case study describes implemented methods
  and states that full-scale results are not verifiable. Owner should fix the repository.

## 9. AmnAI
Code: `detector.py` (Ultralytics YOLO, README: YOLO26n), `tracker.py` (DeepSORT), MediaPipe Pose,
`behavior_analyzer.py`, `behavior_classifier.py` (BiLSTM + attention, heuristic mode),
`train_model.py`. Report gives ranges "80–92 % (LSTM) / 65–75 % (heuristic)" on simulated videos
with no protocol, test size or versioned results → **no metric published**.

## 10. Deep Learning series
Sub-READMEs: Heart MLP 84.8 % (1,266 params, recall 0.91 sick / 0.77 healthy, linear 72.8 %);
fraud MLP recall 84.5 %, precision 60.2 %, ROC-AUC 0.903; multiclass = chance (3.2 % vs 3.3 %);
triage CNN 93.17 % / VGG16 frozen 93.29 %; COCO detectors on 20 X-rays: YOLOv8n 243 ms vs
Faster R-CNN 5,881 ms (speed only, no clinical meaning); KD MNIST teacher only 33.96 %, student
7,539 params; CIFAR-10 student alone 81.77 % > KD 76.53 %. Triage part is partial (README).

## 11. U-Net segmentation
Notebook outputs: baseline val mIoU 0.284, pixel accuracy 0.822; self-distilled val mIoU 0.080,
pixel accuracy 0.482. Self-distillation notebook depends on `src/` modules and checkpoints that are
not published.

## 12. Chance-constrained SVM
4 notebooks (simulated, Breast Cancer, Seeds, Diabetes), CVXPY; outputs report VC bounds and RMSE
tables. No headline metric published (theory-oriented coursework).

## 13. Speaker recognition
OCR of the report: test accuracy 86.98 % on 50 agents (2,250 test samples), validation 86.89 %,
train 92.15 %. `config.py` (NUM_AGENTS=50, SNR 15 dB), `train_model.py` (random stratified split).
- **Corrected**: FR card said "précision" — it is accuracy.
- **Limit**: SNR augmentation is applied per file *before* a non-grouped random split → noisy copies
  of the same recording can fall in train and test; the score is likely optimistic.

## 14. Motorcycle import
`import_moto.py` (Selenium on leparking-moto, customs web portal douane.gov.ma, Avito),
`resultats_analyse_rentabilite.csv`: 83 Yamaha MT-09 listings (Spain), 5 with a positive gross
margin, median margin −20.9 %. **Corrected**: "customs API" → customs web portal automated with
Selenium. CAPTCHA limitation (report).

## 15. Smart irrigation
`app flutter/` (Firebase Auth + Realtime DB, Provider, FL Chart), `esp_32/main.cpp`,
`arduino_mega/*.ino`, README (single active zone, state machine, schedules). No measured result.

---

## Points needing owner approval
1. Publication of the AKWA presentation (deck slide 15 contains raw transactions; names on 1 and 27).
2. Renault case study (built only from already-published experience text).
3. Public AKWA repository exposing `data/*.csv` and the internship report.
4. PointFed3D repository: README numbers come from a mock generator.
5. CV PDFs still mention "6M+" (AKWA) and "86 % precision" (Snani) without context.
