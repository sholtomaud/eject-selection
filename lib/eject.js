'use babel';

import { CompositeDisposable } from 'atom';
import fs from 'fs';
import os from 'os';
import path from 'path';

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'eject:ejectSelection': () => this.ejectSelection()
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  ejectSelection() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let splitted = selection.split(os.EOL);
      let firstLine = splitted[0].split(' ');
      firstLine.shift();
      let fileName = firstLine.join('') + '_' + Date.now() + '.md';
      let filePath = editor.buffer.file.path.split('/');
      filePath.pop();
      let fileDir = filePath.join('/');
      let fullPath = path.join(fileDir,fileName);
      fs.writeFile(fullPath, selection, (err) => {
        if (err) atom.notifications.addWarning(`Error: ${err}`);
        atom.notifications.addSuccess(`Ejected selection to ${fileName}`);
        editor.insertText('');
      });

    }
  }
};
