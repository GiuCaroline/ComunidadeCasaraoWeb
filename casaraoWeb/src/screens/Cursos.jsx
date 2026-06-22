import { DropdownContent } from "../components/dropdownContent"
import { MagnifyingGlass, TrashIcon, PencilSimple, PlusIcon } from "@phosphor-icons/react";

export default function Cursos() {
    return(
        <div className="pt-5 px-4 flex flex-col items-center gap-6">
            <div className="relative w-[95%]">
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    onChange={(text) => console.log('pesquisa: ', text)}
                    className="w-full text-preto dark:text-branco py-3 px-4 pr-12 rounded-full bg-input dark:bg-input-dark shadow-md outline-none"
                />
    
                <MagnifyingGlass
                    size={22}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-preto dark:text-branco"
                />
            </div>
            <DropdownContent />
        </div>
    )
}