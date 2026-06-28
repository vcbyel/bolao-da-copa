export default function BetTabs({
    active,
    setActive,
}) {

    const tabs = [

        {
            label: "R1",
            value: "GROUP_1",
        },

        {
            label: "R2",
            value: "GROUP_2",
        },

        {
            label: "R3",
            value: "GROUP_3",
        },

        {
            label: "16A",
            value: "R16",
        },

        {
            label: "OIT",
            value: "R8",
        },

        {
            label: "QF",
            value: "QF",
        },

        {
            label: "SF",
            value: "SF",
        },

        {
            label: "FINAL",
            value: "FINAL",
        },

    ];

    return (

        <div className="mb-8 overflow-x-auto">

            <div className="flex gap-3 min-w-max">

                {tabs.map(tab => (

                    <button

                        key={tab.value}

                        onClick={() => setActive(tab.value)}

                        className={`

                        px-5

                        py-2

                        rounded-full

                        font-semibold

                        transition

                        whitespace-nowrap

                        ${active === tab.value

                                ? "bg-green-500 text-black"

                                : "bg-slate-700 text-white hover:bg-slate-600"

                            }

                    `}

                    >

                        {tab.label}

                    </button>

                ))}

            </div>

        </div>

    );

}