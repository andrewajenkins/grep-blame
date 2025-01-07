import subprocess
import json
import re
from typing import List, Dict, Any

class GrepBlame:
    def __init__(self, pattern: str, directory: str = ".", file_types: List[str] = None):
        self.pattern = pattern
        self.directory = directory
        self.file_types = file_types or []

    def search(self) -> List[Dict[str, Any]]:
        grep_results = self._run_ripgrep()
        return self._add_git_blame(grep_results)

    def _run_ripgrep(self) -> List[Dict[str, Any]]:
        args = ["rg", self.pattern, self.directory, "--json"]
        for ext in self.file_types:
            args.extend(["-g", f"*.{ext}"])

        try:
            result = subprocess.run(
                args,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                check=True
            )
        except subprocess.CalledProcessError as e:
            print(f"Error running ripgrep: {e.stderr}")
            return []

        return [json.loads(line) for line in result.stdout.splitlines() if line]

    def _add_git_blame(self, grep_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        blame_results = []
        for result in grep_results:
            if result.get("type") == "match":
                file_path = result["data"]["path"]["text"]
                line_number = result["data"]["line_number"]
                blame_info = self._get_git_blame(file_path, line_number)
                if blame_info:
                    blame_results.append({**blame_info, **result["data"]})
        return blame_results

    def _get_git_blame(self, file_path: str, line_number: int) -> Dict[str, str]:
        try:
            result = subprocess.run(
                ["git", "blame", "-L", f"{line_number},{line_number}", file_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                check=True
            ).stdout

            return self._parse_git_blame(result)
        except subprocess.CalledProcessError as e:
            print(f"Error running git blame for {file_path}:{line_number}: {e.stderr}")
            return {}

    def _parse_git_blame(self, blame_output: str) -> Dict[str, str]:
        try:
            commit = re.search(r'^(\w+)', blame_output).group(1)
            author = re.search(r'\((.*?)\d{4}-\d{2}-\d{2}', blame_output).group(1).strip()
            date = re.search(r'\((.*?)\d{4}-\d{2}-\d{2}', blame_output).group(0).split()[1]
            line_num = re.search(r'(\d+)\)', blame_output).group(1)
            content = blame_output.split(') ', 1)[1].strip()

            return {
                "commit": commit,
                "author": author,
                "date": date,
                "line_num": line_num,
                "content": content,
            }
        except (AttributeError, IndexError) as e:
            print(f"Failed to parse git blame output: {blame_output}\nError: {e}")
            return {}

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Grep files and order results by git blame date.")
    parser.add_argument("pattern", help="Search pattern.")
    parser.add_argument("directory", nargs="?", default=".", help="Directory to search.")
    parser.add_argument("-t", "--types", nargs="*", help="File types to include (e.g., py js ts).")

    args = parser.parse_args()

    grep_blame = GrepBlame(pattern=args.pattern, directory=args.directory, file_types=args.types)
    results = grep_blame.search()

    for result in results:
        print(f"{result['path']['text']}:{result['line_number']} {result['commit']} {result['author']} {result['date']} - {result['content']}")
