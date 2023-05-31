# gloat-hunter

Everyone be self-snitching these days. Here's a tool that makes gloat-based OSINT easier to find.

Gloat Hunter does the following:
* Gathers the last 3,200 tweets of a target
* Generates a stand-alone self-contained GUI to conduct offline searches of the targets tweet history
* Provides a list of common queries to assist with common investigative tasks (Coming soon!)
* Provides a link of the self-contained GUI for other researchers to download
* Creates a Jitsi link for people to conduct collaborative research at

# Install

```bash
git clone https://github.com/PsySecGroup/gloat-hunter.git
cd gloat-hunter
```

# Usage

To use `hunt-gloats`, simply replace `elonmusk` with another Twitter account name and a browser will open up with a GUI for target analysis.

You'll also see a CSV, TXT, and an HTML of that account name appear in the `targets` directory.  Feel free to share the HTML file to other researchers for parallel analysis.

```bash
./hunt-gloats elonmusk
```
