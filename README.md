# Test-Dienstplan

Dieser Prototyp liefert eine konfigurierbare Admin- und Planungsoberfläche für Monatsdienstpläne. Alle Daten werden lokal im Browser gespeichert und lassen sich per Klick als JSON-Datei exportieren/importieren – komplett ohne Backend.

## Funktionsumfang
- **Admin-Menüs** für Mitarbeitende, Dienste, Funktionen, Anstellungsverhältnisse, Regeln.
- **Mitarbeitende**: Vor-/Nachname, Personalnummer, Geburtstag, Anstellung (%/Stunden), Funktion, Nachtdienst- und RKT-Checkboxen.
- **Urlaubsverwaltung**: Anspruch in Tagen pro Jahr, beliebig viele Urlaube mit Zeitraum; automatische Resturlaub-Berechnung pro Kalenderjahr samt Warnung bei Überschreitung und Anzeige im Kalender.
- **Dienste**: Name und Zeitfenster (von/bis). Die Dauer wird automatisch berechnet.
- **Funktionen**: Diensten zuordenbar; Funktionen können Mitarbeitenden zugewiesen werden.
- **Anstellungsverhältnisse**: Prozent und Stunden pro Monat; Auswahl der % füllt automatisch die Stunden im Mitarbeitenden-Formular.
- **Regeln**: Ruhezeiten nach Diensten, maximale Wochen-/Monatsstunden, Wochenenden, Nachtdienste sowie Pflichtdienste pro Wochentag **und** österreichischem Feiertag (Salzburg) – Diensten lassen sich komfortabel hinzufügen oder entfernen.
- **Raster-Ansicht**: Linke Spalte mit Name, Personalnummer, Stundensoll und „Noch zu verplanen“; Spalten für alle Tage des Monats mit Wochentag unter dem Datum und je Zelle ein eigenes Dropdown plus Geburtstags-Icon und Urlaubs-Markierung.
- **Offene Dienste**: Unterhalb des Kalenders zeigt eine zusätzliche Zeile pro Tag alle noch unbesetzten Dienste an – sobald alles geplant ist, färbt sich die Zelle grün.
- **Farbcodierung**: Dezente Samstags-/Sonntags-/Feiertags-Hintergründe sorgen für Orientierung, ohne die Lesbarkeit zu beeinträchtigen.
- **Reihenfolge & Gruppen**: Dienstplan-Zeilen lassen sich per Drag & Drop umsortieren, sammeln und mit Gruppenüberschriften versehen; Auswahlboxen mit Gruppenaktionen erleichtern die Strukturierung.
- **Navigation**: Linke Menüleiste zum Umschalten zwischen Dienstplan und Admin-Menüs; Monate per Pfeiltaste oder Buttons wechseln, Start immer im aktuellen Monat.
- **Interaktion**: Zellen per Dropdown setzen, sperren und für die Auto-Generierung ausnehmen; Button „Dienstplan generieren“ verteilt hinterlegte Dienste nach Funktion und Regeln ausschließlich auf Mitarbeitende mit passenden Funktionen.

## Dateien

| Datei | Beschreibung |
| --- | --- |
| `index.html`, `app.js`, `style.css` | Einstiegsseite mit Admin-Bereich, Monatsraster, Generierung und lokalem Datenspeicher (localStorage) plus optionalem JSON-Export/-Import. |

## Starten

1. Kein Build nötig – ein einfacher Webserver genügt.
2. Im Repository-Verzeichnis starten:

   ```bash
   python -m http.server 8000
   ```

3. `http://localhost:8000` im Browser öffnen. Alle Eingaben werden im LocalStorage gespiegelt; über „Speichern als Datei“/„Datei laden“ kann der komplette Datenstand manuell gesichert oder wiederhergestellt werden.
4. Über „Dienstplan generieren“ werden die definierten Dienste pro Tag und Funktion auf passende Mitarbeitende verteilt. Gesperrte Zellen bleiben unverändert; Pflichtdienste pro Wochentag sowie Feiertag und Funktionszuweisungen werden berücksichtigt.

## Feiertage (Salzburg, exemplarisch)
- 1.1. Neujahr
- 6.1. Heilige Drei Könige
- 10.4. Ostermontag
- 1.5. Staatsfeiertag
- 18.5. Christi Himmelfahrt
- 29.5. Pfingstmontag
- 8.6. Fronleichnam
- 15.8. Mariä Himmelfahrt
- 26.10. Nationalfeiertag
- 1.11. Allerheiligen
- 8.12. Maria Empfängnis
- 25.12. Christtag
- 26.12. Stefanitag
