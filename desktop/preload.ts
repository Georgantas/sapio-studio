import { ipcRenderer, contextBridge } from 'electron';

function bitcoin_command(
    command: { method: string; parameters: any[] }[]
): Promise<any> {
    return ipcRenderer.invoke('bitcoin::command', command).then((msg) => {
        if ('ok' in msg) {
            return msg.ok;
        } else if ('err' in msg) {
            throw new Error(JSON.stringify(msg.err));
        }
    });
}

type Result<T> = { ok: T } | { err: string };
function create_contract(
    workspace: string,
    which: string,
    txn: string | null,
    args: string
): Promise<Result<string>> {
    return ipcRenderer.invoke('sapio::create_contract', workspace, [
        which,
        txn,
        args,
    ]);
}

function open_contract_from_file(): Promise<Result<string>> {
    return ipcRenderer.invoke('sapio::open_contract_from_file');
}
function load_wasm_plugin(): Promise<Result<null>> {
    return ipcRenderer.invoke('sapio::load_wasm_plugin');
}

function show_config(): Promise<Result<string>> {
    return ipcRenderer.invoke('sapio::show_config');
}

function load_contract_list() {
    return ipcRenderer.invoke('sapio::load_contract_list');
}

const psbt = {
    finalize: (psbt: string) => {
        return ipcRenderer.invoke('sapio::psbt::finalize', psbt);
    },
};
const compiled_contracts = {
    list: (workspace: string) => {
        return ipcRenderer.invoke('sapio::compiled_contracts::list', workspace);
    },
    trash: (workspace: string, file_name: string) => {
        return ipcRenderer.invoke(
            'sapio::compiled_contracts::trash',
            workspace,
            file_name
        );
    },
    open: (workspace: string, file_name: string) => {
        return ipcRenderer.invoke(
            'sapio::compiled_contracts::open',
            workspace,
            file_name
        );
    },
};
const workspaces = {
    init: (workspace: string) => {
        return ipcRenderer.invoke('sapio::workspaces::init', workspace);
    },
    list: () => {
        return ipcRenderer.invoke('sapio::workspaces::list');
    },
    trash: (workspace: string) => {
        return ipcRenderer.invoke('sapio::workspaces::trash', workspace);
    },
};

function save_psbt(psbt: string): Promise<null> {
    return ipcRenderer.invoke('save_psbt', psbt);
}

function fetch_psbt(): Promise<string> {
    return ipcRenderer.invoke('fetch_psbt');
}
function save_contract(contract: string): Promise<null> {
    return ipcRenderer.invoke('save_contract', contract);
}
function save_settings(which: string, data: string): Promise<boolean> {
    return ipcRenderer.invoke('save_settings', which, data);
}

function load_settings_sync(which: string): any {
    return ipcRenderer.invoke('load_settings_sync', which);
}

function write_clipboard(s: string) {
    ipcRenderer.invoke('write_clipboard', s);
}

function select_filename() {
    return ipcRenderer.invoke('select_filename');
}

function emulator_kill() {
    console.log('Killing');
    return ipcRenderer.invoke('emulator::kill');
}
function emulator_start() {
    return ipcRenderer.invoke('emulator::start');
}
function emulator_read_log(): Promise<string> {
    return ipcRenderer.invoke('emulator::read_log');
}

const chat = {
    init: () => ipcRenderer.invoke('chat::init'),
    send: (message: any /*EnvelopeIn*/) =>
        ipcRenderer.invoke('chat::send', message),
    add_user: (name: string, key: string) =>
        ipcRenderer.invoke('chat::add_user', name, key),
    list_users: () => ipcRenderer.invoke('chat::list_users'),
    list_channels: () => ipcRenderer.invoke('chat::list_channels'),
    list_messages_channel: (channel: string, since: number) =>
        ipcRenderer.invoke('chat::list_messages_channel', channel, since),
};

// to typecheck, uncomment and import preloads
const api /*:preloads*/ = {
    bitcoin_command,
    save_psbt,
    save_contract,
    fetch_psbt,
    write_clipboard,
    save_settings,
    load_settings_sync,
    select_filename,
    sapio: {
        create_contract,
        show_config,
        load_wasm_plugin,
        open_contract_from_file,
        load_contract_list,
        compiled_contracts,
        psbt,
        workspaces,
    },
    emulator: {
        kill: emulator_kill,
        start: emulator_start,
        read_log: emulator_read_log,
    },
    chat,
};
contextBridge.exposeInMainWorld('electron', api);
