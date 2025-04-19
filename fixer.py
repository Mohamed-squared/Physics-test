import re
import sys
import os

def format_markdown(input_filename, output_filename):
    """
    Reformats a Markdown file with exam questions into a cleaner format.

    Handles variations in spacing, option layout, and answer formatting.
    """
    try:
        print(f"\nReading from: '{input_filename}'")
        print(f"Writing to:   '{output_filename}'")

        line_num = 0 # Initialize line number for error reporting
        with open(input_filename, 'r', encoding='utf-8') as infile, \
             open(output_filename, 'w', encoding='utf-8') as outfile:

            current_question_lines = []
            in_question_block = False
            wrote_first_chapter = False # Flag to manage initial newlines

            for line_num, raw_line in enumerate(infile): # Now line_num is correctly tracked
                line = raw_line.strip()

                # --- Handle Chapter Headers ---
                chapter_match = re.match(r"^(###\s+Chapter\s+\d+.*)", line, re.IGNORECASE)
                if chapter_match:
                    if current_question_lines:
                        process_question_block(current_question_lines, outfile)
                        current_question_lines = []
                        in_question_block = False

                    if wrote_first_chapter:
                       outfile.write("\n")
                    outfile.write(f"{chapter_match.group(1).strip()}\n\n")
                    wrote_first_chapter = True
                    continue

                # --- Handle potential stray text/page numbers ---
                if not in_question_block and not wrote_first_chapter and line:
                     outfile.write(raw_line)
                     continue
                elif re.match(r"^\d+\s+Chapter\s+\d+", line) or re.match(r"^\s*\d+\s*$", line):
                     continue

                # --- Handle Question Start ---
                question_start_match = re.match(r"^\s*(\d+)\s*[\.\)](.*)", line)
                if question_start_match:
                    if current_question_lines:
                        process_question_block(current_question_lines, outfile)

                    q_num = question_start_match.group(1)
                    q_text_first_line = question_start_match.group(2).strip()
                    current_question_lines = [f"{q_num}. {q_text_first_line}"]
                    in_question_block = True
                    continue

                # --- Handle lines within a question block ---
                if in_question_block:
                    if line:
                       current_question_lines.append(line)

            # --- Process the last question block after EOF ---
            if current_question_lines:
                process_question_block(current_question_lines, outfile)

        print(f"\nSuccessfully reformatted '{input_filename}' to '{output_filename}'")

    except FileNotFoundError:
        print(f"\nError: Input file '{input_filename}' not found.")
        sys.exit(1)
    except Exception as e:
        # Use the line_num captured in the loop (add 1 for human-readable line number)
        print(f"\nAn error occurred during processing near line {line_num + 1}: {e}")
        print(f"Problematic line content (raw): '{raw_line.strip()}'")
        sys.exit(1)

def process_question_block(lines, writer):
    """
    Parses a block of lines for a single question and writes formatted output.
    """
    if not lines:
        return

    question_num_text_line = lines[0]
    other_lines = lines[1:]

    question_text_lines = [question_num_text_line]
    options_answer_lines = []
    answer = None

    options_started = False
    for line in other_lines:
        stripped_line = line.strip()
        is_option_line = re.match(r"^\s*[A-E]\s*[\.\)](.*)", stripped_line, re.IGNORECASE)
        contains_answer = re.search(r"(?:^|\s)Ans:([A-E])\s*$", stripped_line, re.IGNORECASE)

        if is_option_line or contains_answer:
            options_started = True

        if options_started:
            options_answer_lines.append(line)
        else:
            if stripped_line:
                question_text_lines.append(line)

    writer.write("\n".join(question_text_lines).strip() + "\n")

    combined_options_answer_raw = "\n".join(options_answer_lines).strip()
    combined_options_answer_stripped = " ".join(l.strip() for l in options_answer_lines).strip()

    ans_match = re.search(r"Ans:([A-E])\s*$", combined_options_answer_stripped, re.IGNORECASE)
    if ans_match:
        answer = ans_match.group(1).upper()
        last_ans_index = combined_options_answer_raw.rfind(ans_match.group(0))
        if last_ans_index != -1:
             options_str_raw = combined_options_answer_raw[:last_ans_index].strip()
        else:
             options_str_raw = combined_options_answer_raw # Fallback
    else:
        options_str_raw = combined_options_answer_raw
        # print(f"  Warning: No answer found for question block starting with: '{lines[0][:60]}...'") # Optional warning


    options_str_stripped = " ".join(l.strip() for l in options_str_raw.splitlines())
    option_pattern = r"([A-E])\s*[\.\)]\s*(.*?)(?=\s*[A-E]\s*[\.\)]|\s*$)"
    parsed_options = re.findall(option_pattern, options_str_stripped, re.IGNORECASE | re.DOTALL)

    if parsed_options:
        for letter, text in parsed_options:
            writer.write(f"{letter.upper()}. {text.strip()}\n")
    elif options_str_raw:
         # Write raw option string if regex fails, preserving potential structure
         writer.write(options_str_raw + "\n")


    if answer:
        writer.write(f"ans: {answer}\n")

    writer.write("\n")


# --- Main Execution ---
if __name__ == "__main__":
    # Get input file path from user
    while True:
        input_md = input("Enter the path to the input Markdown file: ").strip()
        if not input_md:
            print("Input path cannot be empty.")
        elif not os.path.exists(input_md):
            print(f"Error: Input file '{input_md}' does not exist. Please try again.")
        else:
            break # Valid input file found

    # Get output file path from user
    while True:
        output_md = input("Enter the desired path for the output Markdown file: ").strip()
        if not output_md:
            print("Output path cannot be empty.")
        # Check if input and output are the same file
        elif os.path.abspath(input_md) == os.path.abspath(output_md):
            print("Error: Output filename cannot be the same as the input filename.")
            print("Please choose a different output filename.")
        else:
            # Optional: Check if output file already exists and warn/ask for overwrite
            if os.path.exists(output_md):
                overwrite = input(f"Warning: Output file '{output_md}' already exists. Overwrite? (y/n): ").lower()
                if overwrite != 'y':
                    print("Operation cancelled.")
                    sys.exit(0)
            break # Valid output path

    # Call the main formatting function
    format_markdown(input_md, output_md)