select * from [dbo].['石管處埤塘基本資料398口']
select * from [dbo].['桃園管理處各貯水池能量表(總表)_修']
select * from [dbo].['桃管處埤塘基本資料284口']
select * from [dbo].['gis-埤塘-石門管理處、桃園管理處']

--clean
delete from [dbo].['桃管處埤塘基本資料284口'] where [埤塘編號] is null

--資料對齊gis資料
update [dbo].['桃管處埤塘基本資料284口']
set [工作站] = [工作站] + '工作站'


--
select * 
from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis
     inner join [dbo].['桃管處埤塘基本資料284口'] t
             on gis.[埤塘名稱] = t.[埤塘名稱]
                and gis.[工作站名稱] = t.[工作站] --+ '工作站'
        -- on gis.[埤塘名稱] like '%' + t.[埤塘名稱] + '%'


select * 
from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis
     inner join [dbo].['石管處埤塘基本資料398口'] t
             on gis.[埤塘名稱] = t.[埤塘名稱]
                and gis.[工作站名稱] = t.[工作站] --+ '工作站'

select * from [dbo].['石管處埤塘基本資料398口']

-- select  *
-- from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis
-- where gis.管理處名稱 = '石門管理處' and gis.工作站名稱 = '楊梅工作站'

select distinct gis.原水利小組名稱
from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis

-- with distinctGisPond as (
--     select distinct [埤塘名稱]
--     from [dbo].['gis-埤塘-石門管理處、桃園管理處']
-- )
-- select * 
-- from distinctGisPond gis
--      inner join [dbo].['桃管處埤塘基本資料284口'] t
--              on gis.[埤塘名稱] = t.[埤塘名稱]
--                 and


select distinct [管理處名稱], [分處名稱], [工作站名稱], [水利小組名稱], [原水利小組名稱], [埤塘名稱]
from [dbo].['gis-埤塘-石門管理處、桃園管理處'] gis
for json path, include_null_values

-- select [埤塘名稱], [工作站], count(*) cc
-- from [dbo].['桃管處埤塘基本資料284口']
-- group by [埤塘名稱], [工作站]
-- order by cc desc


/*產出給firebase的資料*/
select * from [dbo].['gis-埤塘-石門管理處、桃園管理處'] for json path, include_null_values

select 
    "埤塘編號", 
    "管理處", 
    "工作站", 
    "埤塘名稱", 
    "供水支渠", 
    "支線", 
    "水源別", 
    "行政區", 
    cast("土地持分比例(%)" as Decimal(18, 8)) "土地持分比例(%)", 
    cast("埤池面積 (m2)" as Decimal(18, 8)) "埤池面積(m2)", 
    cast("設計庫容(m3)" as Decimal(18, 8)) "設計庫容(m3)" , 
    cast("有效庫容(m3)" as Decimal(18, 8)) "有效庫容(m3)" , 
    cast("灌溉面積(公頃)" as Decimal(18, 8)) "灌溉面積(公頃)", 
    cast("緯度座標" as Decimal(18, 8)) "緯度座標", 
    cast("經度座標" as Decimal(18, 8)) "經度座標", 
    "重要濕地", 
    "生態敏感區域", 
    "農業供灌用途", 
    "工業用水用途", 
    "魚介用途", 
    "休憩綠美化用途", 
    "灌溉功能", 
    "備註1", 
    "備註2"
    from [dbo].['桃管處埤塘基本資料284口'] for json path, include_null_values

SELECT *
from [dbo].['桃管處埤塘基本資料284口']