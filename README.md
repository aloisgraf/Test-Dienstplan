# Test-Dienstplan

Dieser Prototyp liefert eine konfigurierbare Admin- und Planungsoberfläche für Monatsdienstpläne. Alle Daten werden lokal im Browser gespeichert und lassen sich per Klick als JSON-Datei exportieren/importieren – komplett ohne Backend.

## Funktionsumfang
- **Admin-Menüs** für Mitarbeiter, Dienste, Funktionen, Anstellungsverhältnisse und Regeln – jeder Bereich besitzt jetzt ein eigenes Protokoll, das jede Anlage, Änderung oder Löschung mit Zeitstempel dokumentiert.
- **Übersichten & Logs**: Unter jedem Formular hebt ein separater Überblicksblock die bestehenden Datensätze hervor; darin können die Log-Einträge per Klick ein- oder ausgeklappt werden.
- **Mitarbeiter**: Vor-/Nachname, Personalnummer, Geburtstag, Anstellung (%/Stunden), Funktion, Nachtdienst-/RKT-Flags sowie Durchrechnungsfaktor, tägliche Sollarbeitszeit und Urlaubsanspruch. Ein Auswahl-Dropdown lädt bestehende Datensätze und fordert beim Überschreiben eine Bestätigung.
- **Urlaubs- & Krankenstandsverwaltung**: Beliebig viele Urlaube und Krankenstände pro Person. Die Resttage pro Kalenderjahr werden automatisch berechnet, bei Überschreitung erfolgt eine Warnung, im Raster erscheinen „U“-/„K“-Marker und gesperrte Zellen. Der Status „Krankmeldung erhalten“ lässt sich jetzt direkt in der Krankenstandsübersicht per Checkbox nachpflegen.
- **Urlaubsübertrag**: Der offene Resturlaub des laufenden Jahres wird automatisch auf das Folgejahr addiert und sowohl in der Mitarbeiterliste als auch im Urlaubs-Panel kommuniziert (inkl. Hinweis auf den Übertrag).
- **Dienste**: Name und Zeitfenster (von/bis) mit automatischer Dauerberechnung und Logeintrag bei Änderungen.
- **Funktionen**: Bündeln Diensten und können Mitarbeitern zugeordnet werden; jede Speicherung landet im Protokoll.
- **Anstellungsverhältnisse**: Prozent und Stunden pro Monat; die Prozent-Auswahl trägt die zugehörigen Stunden automatisch ins Formular und protokolliert jede Version.
- **Regeln**: Ruhezeiten, Wochen-/Monatsstunden, Wochenenden, Nachtdienste plus Pflichtdienste für jeden Wochentag und Salzburger Feiertage – inklusive Chip-UI zum Hinzufügen/Entfernen und Logeintrag beim Speichern.
- **Durchrechnungsfaktor & Sollarbeitszeit**: Feiertage zählen automatisch den hinterlegten Durchrechnungsfaktor, Urlaube und Krankenstände buchen die tägliche Sollarbeitszeit – beides fließt direkt in „Noch zu verplanen“ ein.
- **Raster-Ansicht**: Linke Spalte mit Name/Personalnummer, Stundensoll und „Noch zu verplanen“, rechts gleich breite Tagesspalten mit Datum & Wochentag, Geburtstags-Icon, U/K-Badges, Sperr-Checkbox und Dropdown je Zelle.
- **Offene Dienste**: Unterhalb des Kalenders zeigt eine zusätzliche Zeile pro Tag alle noch unbesetzten Dienste an – sobald alles geplant ist, färbt sich die Zelle grün.
- **Farbcodierung**: Dezente Hintergründe für Samstag, Sonntag und Feiertage sorgen für Orientierung, bleiben aber gut lesbar.
- **Reihenfolge & Gruppen**: Drag-&-Drop-Sortierung, Gruppierung und Umbenennen/Löschen von Gruppen inklusive Kontextbuttons im linken Menübereich, die erst erscheinen, wenn mindestens eine Zeile ausgewählt ist (die Dienstplan-Ansicht bleibt dadurch stabil, selbst wenn eine Gruppenerstellung abgebrochen wird).
- **Navigation & Datenablage**: Linke Menüleiste zum Umschalten zwischen Dienstplan und Admin-Formularen, Pfeiltasten- und Button-Navigation durch die Monate sowie ein eigener Block für den JSON-Export/-Import.
- **Interaktion & Auto-Planung**: Dropdowns setzen Dienste direkt, Sperren schützen Zellen; „Dienstplan generieren“ berücksichtigt Funktionen, Wochentags-/Feiertagsregeln, Nachtdienst-Restriktionen, Urlaube, Krankenstände, Sperren und alle Limitwerte.

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
