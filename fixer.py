import re
import sys
import os

def fix_markdown_structure(input_filename="chapters.md", output_filename="chapters_fixed.md"):
    """
    Reads the input markdown file, adds chapter headings, cleans answer lines,
    and writes to the output file.
    """
    print(f"Processing '{input_filename}'...")
    if not os.path.exists(input_filename):
        print(f"Error: Input file '{input_filename}' not found.")
        sys.exit(1)

    # Regex to find chapter lines (potentially with page numbers)
    # Catches "Chapter X: TITLE", "XXX Chapter X: TITLE"
    chapter_regex = re.compile(r"^(?:\d+\s+)?Chapter\s+(\d+)\s*:\s*(.*)$", re.IGNORECASE)
    # Regex to find question starts
    question_start_regex = re.compile(r"^\s*(\d+[\.\)])\s+.*")
    # Regex to find answer lines and extract the letter
    answer_regex = re.compile(r"^(.*?\s+|)(?:ans|answer)\s*:\s*([A-E])(?:$|\s+.*)", re.IGNORECASE)

    current_chapter = None
    lines_processed = 0
    chapters_found = 0
    questions_found = 0
    answers_cleaned = 0

    try:
        with open(input_filename, 'r', encoding='utf-8') as infile, \
             open(output_filename, 'w', encoding='utf-8') as outfile:

            for line in infile:
                lines_processed += 1
                original_line = line # Keep original for comparison if needed

                # --- 1. Check for Chapter Header ---
                chapter_match = chapter_regex.match(line.strip())
                if chapter_match:
                    chapter_num = chapter_match.group(1)
                    # chapter_title = chapter_match.group(2).strip() # Title not used by JS
                    if chapter_num != current_chapter:
                        print(f"  Found Chapter {chapter_num} on line {lines_processed}")
                        outfile.write(f"\n### Chapter {chapter_num}\n\n") # Add markdown heading
                        current_chapter = chapter_num
                        chapters_found += 1
                    continue # Skip writing the original chapter line

                # Skip blank lines immediately after finding a chapter
                if not line.strip() and current_chapter and chapters_found > 0 and lines_processed < chapters_found + 5 : # Heuristic to skip page number lines etc.
                     continue


                # --- 2. Check for Answer Line ---
                answer_match = answer_regex.match(line.strip())
                if answer_match:
                    answer_letter = answer_match.group(2).upper()
                    # Write ONLY the standardized answer format on its own line
                    outfile.write(f"ans: {answer_letter}\n")
                    answers_cleaned += 1
                    continue # Skip writing the original answer line

                # --- 3. Check for Question Start ---
                if question_start_regex.match(line.strip()):
                     questions_found +=1
                     # Optional: Add extra newline before question for better spacing
                     # outfile.write("\n")

                # --- 4. Write other lines (questions, images, text) as is ---
                # (Could add more cleaning here if needed, e.g., removing trailing page numbers)
                outfile.write(original_line)

        print("-" * 30)
        print(f"Processing complete.")
        print(f"  Lines processed: {lines_processed}")
        print(f"  Chapters found/formatted: {chapters_found}")
        print(f"  Potential questions found: {questions_found}")
        print(f"  Answer lines cleaned: {answers_cleaned}")
        print(f"Output saved to '{output_filename}'")
        if chapters_found == 0:
             print("\nWarning: No chapter headers matching the pattern were found. The output file might not be correctly structured.")

    except Exception as e:
        print(f"\nAn error occurred during processing: {e}")
        sys.exit(1)

# --- Run the script ---
if __name__ == "__main__":
    # You can change the input/output filenames here if needed
    fix_markdown_structure(input_filename="chapters.md", output_filename="chapters_fixed.md")