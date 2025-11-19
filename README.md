# Test-Dienstplan

Dieser Prototyp liefert eine konfigurierbare Admin- und Planungsoberfläche für Monatsdienstpläne. Alle Daten werden lokal im Browser gespeichert und können ohne Backend ausprobiert werden.

## Funktionsumfang
- **Admin-Menüs** für Mitarbeitende, Dienste, Funktionen, Anstellungsverhältnisse, Regeln.
- **Mitarbeitende**: Vor-/Nachname, Personalnummer, Geburtstag, Anstellung (%/Stunden), Funktion, Nacht- und RKT-Checkboxen.
- **Dienste**: Name und Zeitfenster (von/bis). Die Dauer wird automatisch berechnet.
- **Funktionen**: Diensten zuordenbar; Funktionen können Mitarbeitenden zugewiesen werden.
- **Anstellungsverhältnisse**: Prozent und Stunden pro Monat; Auswahl der % füllt automatisch die Stunden im Mitarbeitenden-Formular.
- **Regeln**: Ruhezeiten nach Diensten, maximale Wochen-/Monatsstunden, Wochenenden und Nachtdienste für die automatische Generierung.
- **Raster-Ansicht**: Linke Spalten mit Name, Personalnummer und Stundensoll sowie eine zusätzliche Spalte „Noch zu verplanen“, die sofort zeigt, wie viele Stunden zum Sollwert fehlen. Danach folgen Tages-Spalten mit Datum und Wochentag.
- **Farbcodierung**: Samstage hellgrau, Sonntage dunkelgrau, österreichische Feiertage (Salzburg) gelb.
- **Navigation**: Linke Menüleiste zum Umschalten zwischen Dienstplan und Admin-Menüs; Monate per Pfeiltaste oder Buttons wechseln, Start immer im aktuellen Monat.
- **Interaktion**: Zellen per Dropdown setzen, sperren und für die Auto-Generierung ausnehmen; Button „Dienstplan generieren“ verteilt hinterlegte Dienste nach Funktion und Regeln.

## Dateien

| Datei | Beschreibung |
| --- | --- |
| `index.html`, `app.js`, `style.css` | Einstiegsseite mit Admin-Bereich, Monatsraster, Generierung und lokalem Datenspeicher (localStorage). |

## Starten

1. Kein Build nötig – ein einfacher Webserver genügt.
2. Im Repository-Verzeichnis starten:

   ```bash
   python -m http.server 8000
   ```

3. `http://localhost:8000` im Browser öffnen. Alle Eingaben werden im LocalStorage gespeichert; ein Refresh lässt die Daten bestehen.
4. Über „Dienstplan generieren“ werden die definierten Dienste pro Tag und Funktion auf passende Mitarbeitende verteilt. Gesperrte Zellen bleiben unverändert.

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
