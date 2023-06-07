# gloat-hunter

Everyone be self-snitching these days. Here's a tool that makes finding PII on a Twitter user super easy.

![image](https://user-images.githubusercontent.com/76200774/243126368-f15ecad3-0819-4f1b-8ca1-d52a3089f646.png)

![image](https://github.com/PsySecGroup/gloat-hunter/assets/76200774/cd01770e-4b13-4e2e-b01c-b6f7a1c31ae7)

![image](https://github.com/PsySecGroup/gloat-hunter/assets/76200774/afa933a6-511a-4a1e-a8b2-36f62233c6d4)

![image](https://user-images.githubusercontent.com/76200774/243919355-b1dfc2ec-6169-4d91-bb90-62d1370c93e6.png)

## Features

* Gathers the last 3,200 tweets of a target
* Generates a standalone self-contained GUI to conduct offline searches of the targets tweet history
* Supports queries with AND, OR, and NOT conditions
* Supports queries with quotes for exact match searching
* Provides an in-browser video chat for investigators to coordinate and collaborate
* Buttons populated with result counts for common investigative queries
* Provides line charts of their engagement

### Coming Soon

* Generates a link for others to download the GUI
* Bounty System

## Quick Start

[![Open in Cloud Shell](https://user-images.githubusercontent.com/27065646/92304704-8d146d80-ef80-11ea-8c29-0deaabb1c702.png)](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/psysecgroup/gloat-hunter&tutorial=README.md)
<a href="https://repl.it/github/psysecgroup/gloat-hunter"><img src="https://replit.com/badge/github/psysecgroup/gloat-hunter" alt="Run on Replit" height="50"></a>

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
