# Test-Dienstplan

Dieser Prototyp enthält einen vollständigen Dienstplan für den Dezember (01.–31.12.)
mit zehn Mitarbeitenden und vier täglichen Diensten:

- **NCN** – Nacht Calltaker
- **NdN** – Nacht Disponent*in
- **ND1** – Tag Disponent*in
- **C1** – Tag Calltaker

Alle 31 Kalendertage wurden besetzt. Für jede Schicht gilt eine Dauer von 12 Stunden.

## Dateien

| Datei | Beschreibung |
| --- | --- |
| `dienstplan_dezember_2023.csv` | Tabellarischer Dienstplan (CSV, Semikolon-getrennt) mit Datum, Wochentag und den vier Diensten pro Tag. |
| `dienstplan_dezember_2023.md` | Markdown-Version des Plans inkl. tabellarischer Übersicht und Kennzahlen je Mitarbeiter*in. |
| `dienstplan_auswertung_dezember_2023.csv` | Verdichtete Auswertung: Anzahl Schichten, Stunden, Nachtschichten und Wochenenden im Dienst pro Mitarbeiter*in. |
| `index.html`, `app.js`, `style.css`, `schedule-data.js` | Einfache Web-Ansicht des Dienstplans mit Filtermöglichkeiten, Nachtschicht-Highlighting und Zusammenfassung je Mitarbeiter*in. |

## Eckdaten des Plans

- Wochenarbeitszeit: Keine Mitarbeiter*in überschreitet 40 Stunden pro Kalenderwoche.
- Monatsarbeitszeit: Alle Mitarbeitenden bleiben unter 173 Stunden (max. 168 h).
- Wochenenden: Jeder Mitarbeitende ist exakt an zwei Wochenenden eingeteilt und hat drei Wochenenden frei.
- Nachtdienste: Die Verteilung der 62 Nacht-Schichten führt – aufgrund der geraden Tagesanzahl – zu sechs Nachtdiensten für acht Mitarbeitende und sieben Nachtdiensten für zwei Mitarbeitende.

Weitere Detaildaten sind in den CSV- und Markdown-Dateien enthalten.

## Web-Ansicht lokal starten

1. Abhängigkeiten sind nicht erforderlich; ein einfacher Webserver reicht aus.
2. Starten Sie z. B. mit Python einen lokalen Server im Repository-Verzeichnis:

   ```bash
   python -m http.server 8000
   ```

3. Öffnen Sie `http://localhost:8000` im Browser. Die Seite erlaubt Filter nach Mitarbeiter*in, Dienst und Wochenenden, hebt Nachtschichten hervor und zeigt eine verdichtete Verteilung je Mitarbeiter*in an.
