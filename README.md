# gloat-hunter

Everyone be self-snitching these days. Here's a tool that makes gloat-based OSINT easier to find.

![image](https://github.com/PsySecGroup/gloat-hunter/assets/76200774/8221c58e-d86b-4d15-9266-217630be8e00)

![image](https://github.com/PsySecGroup/gloat-hunter/assets/76200774/cd01770e-4b13-4e2e-b01c-b6f7a1c31ae7)

![image](https://github.com/PsySecGroup/gloat-hunter/assets/76200774/afa933a6-511a-4a1e-a8b2-36f62233c6d4)

## Features

* Gathers the last 3,200 tweets of a target
* Generates a standalone self-contained GUI to conduct offline searches of the targets tweet history
* Supports queries with OR to search for multiple phrases at the same time
* Supports queries with quotes for exact match searching
* Provides an in-browser video chat for investigators to coordinate and collaborate

### Coming Soon

* Provides a list of common queries to assist with common investigative tasks
* Generates a link for others to download the GUI
* Bounty System

## Requires

* Python
* Unix-like standards (awk, grep, gsub, sed, mktime, print, strftime, echo, comamnd)
* curl/wget
* xdg-open/open/start

## Install

```bash
git clone https://github.com/PsySecGroup/gloat-hunter.git
cd gloat-hunter
```

## Usage

To use `hunt-gloats`, simply replace `elonmusk` with another Twitter account name and a browser will open up with a GUI for target analysis.

You'll also see a CSV, TXT, and an HTML of that account name appear in the `targets` directory.  Feel free to share the HTML file to other researchers for parallel analysis.

```bash
./hunt-gloats elonmusk
```
