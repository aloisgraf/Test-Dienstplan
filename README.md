# Test-Dienstplan

Dieser Prototyp liefert eine konfigurierbare Admin- und Planungsoberfläche für Monatsdienstpläne. Alle Daten werden lokal im Browser gespeichert und lassen sich per Klick als JSON-Datei exportieren/importieren – komplett ohne Backend.

## Funktionsumfang
- **Helles oder dunkles UI**: Ganz oben steht ein Darstellungs-Schalter bereit, der zwischen hellem und dunklem Modus wechselt und den Browser-Storage nutzt.
- **Navigation unter „Dienstplan“**: Alle Admin-Bereiche hängen als Unterpunkte am linken Dienstplan-Menü, inklusive JSON-Datenablage sowie gruppenbezogener Werkzeuge.
- **Zwei Dienstplan-Modi**: „Dienstplan bearbeiten“ mit Dropdowns/Sperren sowie eine reine „Dienstplan Ansicht“, die alle Einträge wie finale U/K/P/SU-Pills darstellt. Ein eigener Button erstellt eine druckoptimierte PDF (Querformat) inklusive Dienstlegende.
- **Stunden- & Dienstmetriken**: Neben Stundensoll und „Noch zu verplanen“ zeigt jede Zeile jetzt die Anzahl der Nachtdienste sowie der Sonn-/Feiertagsdienste; Unterdeckung färbt sich rot.
- **Nicht verplante Dienste & Legende**: Die Zusatzzeile unter dem Raster listet pro Tag alle offenen Dienste und färbt sich grün, sobald alles verplant ist. Darunter erläutert eine Legende die Dienstzeiten.
- **Eintritts-/Austrittslogik**: Mitarbeitende erscheinen erst ab ihrem Eintrittsdatum bzw. verschwinden nach dem Austritt. Das Stundensoll pro Monat wird aliquot nach aktiven Tagen berechnet.
- **Mitarbeiterverwaltung**: Dropdown zum Laden bestehender Personen, Bestätigungsdialog beim Überschreiben, Anzeige von Urlaubskontingent inkl. Übertrag sowie neue Felder für Durchrechnungsfaktor, tägliche Sollarbeitszeit, Urlaubsanspruch und Personalnummer.
- **Offene Krankmeldungen**: In der Mitarbeiter-Übersicht steht zusätzlich ein Panel mit allen nicht bestätigten Krankenständen samt Status-Icon und Datum.
- **Urlaubsarten**: Urlaub, Sonderurlaub und Sonderurlaub 2 (mit Pflichtfeld „Grund“). Sonderurlaub 2 behält den ursprünglichen Dienst (durchgestrichen), andere Varianten blocken und rechnen automatisch die tägliche Sollarbeitszeit. Alle Urlaube erscheinen in der Übersicht, im Kalender als Pillen und in den Logs.
- **Krankenstandsarten**: Krankenstand, Pflegeurlaub und Pflegeurlaub 2 mit separater „Krankmeldung erhalten“-Checkbox, Icons für fehlende/bestätigte Meldungen und Anzeige als K/P/P2 im Raster (Pflegeurlaub 2 hält den Dienst strichmarkiert).
- **Übersichtskarten mit Logs**: Jeder gespeicherte Datensatz (Mitarbeiter, Dienste, Funktionen, Anstellungsverhältnisse, Regeln) besitzt direkt angehängte Details-Blöcke mit Urlaubs-/Krankenstandlisten bzw. Bereichs-Logs, die sich pro Eintrag auf- und zuklappen lassen.
- **Dienste, Funktionen & Anstellungsverhältnisse**: Namen, Zeitfenster sowie Nachtdienst-Flags werden gespeichert, protokolliert und stehen sofort in allen Dropdowns zur Verfügung.
- **Regelwerk**: Ruhezeiten, Wochen-/Monatsstunden, Wochenenden, Nachtdienste sowie Pflichtdienste pro Wochentag oder Feiertag lassen sich per Chip-UI pflegen; Änderungen landen im Regel-Log.
- **Gruppierung & Sortierung**: Mitarbeitende können per Checkbox ausgewählt, gruppiert, umsortiert oder aus Gruppen gelöst werden; die Werkzeuge erscheinen erst bei aktiver Auswahl.
- **Urlaubsmonitor & Limits**: Ein eigener Monitor zeigt täglich, wie viele Personen bereits Urlaub haben (inklusive grafischem Balken) und welche Limits gelten. Limits lassen sich pro Tag speichern und blockieren neue Urlaube automatisch; ausgeschöpfte Tage werden rot markiert.
- **Navigation & Speicherung**: Linkes Menü zum Umschalten zwischen Dienstplan und Admin-Bereichen (inklusive Urlaubsmonitor), Monatsnavigation via Buttons/Pfeiltasten sowie ein JSON-Export/-Import („Datenablage“) für lokale Sicherungen.
- **Automatische Planung**: Die Generator-Logik verteilt Dienste gemäß Funktionen, Regeln, Nacht-/Wochenendlmits, Urlaubs-/Krankenstands-Sperren sowie individuellen Zell-Sperren und respektiert Sonderurlaub/Pflegeurlaub 2.

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
4. Über „Dienstplan generieren“ werden die definierten Dienste pro Tag und Funktion auf passende Mitarbeiter verteilt. Gesperrte Zellen bleiben unverändert; Pflichtdienste pro Wochentag sowie Feiertag und Funktionszuweisungen werden berücksichtigt.

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
