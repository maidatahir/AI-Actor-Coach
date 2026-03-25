from script_parser import parse_script_text

sample_script = """
INT. HOUSE - DAY

SONNY
You hurt my sister again and I'll kill you!

(Carlo backs away in fear.)

CONNIE
Please stop Sonny!

Sonny punches Carlo violently.
"""

result = parse_script_text(sample_script)

print("\nFINAL OUTPUT:\n")
print(result)